<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\NotificationRepositoryInterface;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Cache;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\Notifications;

class NotificationStreamController extends Controller
{

    // protected $contractRepository;
    // protected $orderRepository;
    // protected $userRepository;
    // protected $apartmentRepository;
    // protected $buidungRepository;
    // protected $apartmentImgRepository;
    protected $notificationRepository;

    public function __construct(
        // ContractRepositoryInterface $contractRepository,
        // OrderRepositoryInterface $OrderRepository,
        // UserRepositoryInterface $userRepository,
        // BuildingRepositoryInterface $buidungRepository,
        // ApartmentRepositoryInterface $apartmentRepository,
        // ApartmentImgRepositoryInterface $apartmentImgRepository,
        NotificationRepositoryInterface $notificationRepository,

    ) {
        // $this->contractRepository = $contractRepository;
        // $this->orderRepository = $OrderRepository;
        // $this->userRepository = $userRepository;
        // $this->buidungRepository = $buidungRepository;
        // $this->apartmentRepository = $apartmentRepository;
        // $this->apartmentImgRepository = $apartmentImgRepository;
        $this->notificationRepository = $notificationRepository;
    }
    public function stream(Request $request)
    {
        ignore_user_abort(true);
        set_time_limit(0);

        $token = $request->query('token');
        if (!$token) {
            abort(401, 'Token không tồn tại');
        }

        try {
            $payload = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));
            $userId = $payload->sub;
        } catch (\Exception $e) {
            abort(401, 'Token không hợp lệ');
        }

        // ✅ Tạo ID riêng cho mỗi kết nối (mỗi tab, mỗi FE)
        $connectionId = uniqid('conn_', true);

        $response = new StreamedResponse(function () use ($userId, $connectionId) {
            echo "retry: 5000\n";
            echo "event: connected\n";
            echo "data: {\"connection_id\": \"$connectionId\"}\n\n";
            ob_flush();
            flush();

            // ✅ Đăng ký kết nối vào danh sách
            $connections = Cache::get("user:{$userId}:connections", []);
            $connections[$connectionId] = now()->timestamp;
            Cache::put("user:{$userId}:connections", $connections, 3600);

            while (true) {
                if (connection_aborted()) {
                    // ✅ Xóa kết nối khi client ngắt
                    $connections = Cache::get("user:{$userId}:connections", []);
                    unset($connections[$connectionId]);
                    Cache::put("user:{$userId}:connections", $connections, 3600);
                    break;
                }

                // ✅ Lấy thông báo mới nhất (vẫn dùng chung cho user)
                $notifications = Cache::pull("user:{$userId}:notifications", []);
                foreach ($notifications as $n) {
                    echo "event: notification\n";
                    echo "data: " . json_encode($n) . "\n\n";
                    ob_flush();
                    flush();
                }

                // Gửi heartbeat giữ kết nối
                echo "event: heartbeat\n";
                echo "data: {}\n\n";
                ob_flush();
                flush();

                sleep(10);
            }
        });

        // Header chuẩn SSE
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no');

        // ✅ Cho phép nhiều frontend
        $allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:3001',
        ];
        $origin = $request->headers->get('Origin');
        if (in_array($origin, $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
        }

        return $response;
    }

    // ✅ Gửi thông báo tới tất cả kết nối của user
    public function getNotificationsByUserId() // Đổi tên hàm để chuẩn hóa hơn
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Truy cập bị từ chối. Vui lòng đăng nhập.',
                'data' => null,
            ], 401); // 401 Unauthorized (Không được phép)
        }

        $user_id = $user->id;

        try {
            // 2. Gọi Repository để lấy dữ liệu
            $data = $this->notificationRepository->fetchByUserId($user_id);

            // 3. Trả về thành công
            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách thông báo thành công.',
                'data' => $data,
            ], 200); // 200 OK (Thành công)

        } catch (\Exception $e) { // Nên bắt \Exception thay vì \Throwable chung chung
            \Log::error("Lỗi lấy thông báo cho User ID {$user_id}: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý yêu cầu.',
                'data' => null,
            ], 500); // 500 Internal Server Error (Lỗi máy chủ nội bộ)
        }
    }
    public function markAllAsRead()
    {
        try {
            $userId = auth()->id();
            Notifications::where('user_id', $userId)
                ->where('status', 'unread')
                ->update(['status' => 'read']);

            return response()->json(['success' => true, 'message' => 'Đã đánh dấu tất cả thông báo là đã đọc!']);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }


}
