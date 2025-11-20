<?php
namespace App\Http\Controllers;

use App\Mail\EmailViewingSchedule;
use App\Models\Apartment;
use App\Models\Building;
use App\Models\ChatHistory;
use App\Models\RentalOrder;
use App\Models\ViewingSchedule;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\ViewingSchedulesRepositoryInterface;
use App\Repositories\Interfaces\NotificationRepositoryInterface;
use Doctrine\Common\Lexer\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Services\OpenAIFunctions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;

class ChatBoxProController extends Controller
{
    protected $Apartment;
    protected $building;
    protected $bookingService;
    protected $userRepostory;
    protected $notification;
    public function __construct(
        ApartmentRepositoryInterface $apartmentRepo,
        BuildingRepositoryInterface $buildingRepository,
        ViewingSchedulesRepositoryInterface $data,
        UserRepositoryInterface $user,
        NotificationRepositoryInterface $notification,
    ) {
        $this->Apartment = $apartmentRepo;
        $this->building = $buildingRepository;
        $this->bookingService = $data;
        $this->userRepostory = $user;
        $this->notification = $notification;
    }




    /**
     * Hàm chính nhận tin nhắn từ user
     */
    public function chatBot(Request $request)
    {
        set_time_limit(300); // tăng thời gian tối đa xử lý request
        $userMessage = $request->input('message');
        $user = $request->user();

        // Lấy lịch sử chat gần nhất 10 tin nhắn
        $chatHistory = ChatHistory::where('user_id', $user->id)
            ->orderBy('created_at')
            ->limit(10)
            ->get(['role', 'content'])
            ->toArray();

        // Thêm system messages nếu chưa có
        $this->ensureSystemMessages($chatHistory, $user->id);

        // Lưu tin nhắn user
        $this->addHistory($userMessage, 'user', $user->id);

        $chatHistory[] = [
            'role' => 'user',
            'content' => $userMessage,
        ];

        // Gọi AI
        return $this->callAI($chatHistory, $user->id);
    }

    /**
     * Thêm system messages hướng dẫn AI nếu chưa có
     */
    private function ensureSystemMessages(array &$chatHistory, $userId)
    {
        $hasSystem = collect($chatHistory)->contains(fn($msg) => $msg['role'] === 'system');
        if ($hasSystem)
            return;

        $systemMessageFiles = [
            // 'quy_tac.txt',
            // 'tai_lieu.txt',
            // 'chi_co_dia_chi.jsonl',
            // 'dia_danh_noi_tieng.jsonl',
            // 'gia_mo_ho.jsonl',
            // 'thieu_gia.jsonl',
            // 'thieu_nguoi.jsonl',
            // 'thieu_vi_tr.jsonl',
            // 'thong_tin_day_du.jsonl'
            'ai_pro2.txt'
        ];

        foreach ($systemMessageFiles as $file) {
            $content = file_get_contents(base_path("config/apps/data_AI/$file"));
            $msg = ['role' => 'system', 'content' => $content];
            $chatHistory[] = $msg;
            $this->addHistory($content, 'system', $userId);
        }
    }

    /**
     * Gọi AI, retry tối đa 3 lần khi lỗi
     */
    private function callAI(array $chatHistory, $userId, $retryCount = 0)
    {
        if ($retryCount > 3) {
            return response()->json(['error' => 'Hệ thống phản hồi không hợp lệ nhiều lần. Vui lòng thử lại sau.'], 500);
        }


        $response = Http::timeout(120)
            ->retry(3, 2000)
            ->withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ])
            // ->post('https://openrouter.ai/api/v1/chat/completions', [
            ->post('https://v98store.com/v1/chat/completions', [
                'model' => 'gpt-4.1-mini',
                'messages' => $chatHistory,
                'temperature' => 0.7,
                'stream' => false,
                'functions' => OpenAIFunctions::definitions(),
                'function_call' => 'auto',
            ]);

        if ($response->successful()) {
            $botReply = $response->json();
            return $this->handleBotReply($botReply, $userId, $chatHistory, $retryCount + 1);
        }

        $this->addHistory('Tôi vẫn chưa hiểu yêu cầu của bạn', 'assistant', $userId);
        return response()->json([
            'error' => 'Hệ thống gặp sự cố, vui lòng thử lại sau.'
        ], 500);
    }

    /**
     * Xử lý phản hồi từ AI
     */
    private function handleBotReply($botReply, $userId, $chatHistory, $retryCount = 0)
    {
        if ($botReply['choices'][0]['message']['content'] === null) {
            $parsedData = $this->parseChatbotContent($botReply['choices'][0]['message']['function_call']['arguments']);
            $name = $botReply['choices'][0]['message']['function_call']['name'];
        }

        // if (!is_array($parsedData) || !isset($parsedData['content'])) {
        //     $chatHistory[] = ['role' => 'user', 'content' => 'Phản hồi sai định dạng JSON, yêu cầu trả lại đúng JSON.'];
        //     return $this->callAI($chatHistory, $userId, $retryCount);
        // }

        if (isset($name)) {
            switch ($name) {
                case 'findNearbyApartment':
                    return $this->searchRoom($parsedData, $userId, $botReply);
                case 'searchApartment':
                    // Tìm căn hộ theo quận/phường/tên đường
                    return $this->searchApartment($parsedData, $userId, $botReply);
                case 'findApartmentByName':
                    // Tìm căn hộ theo tên cụ thể
                    return $this->findApartmentByName($parsedData, $userId, $botReply);
                case 'createViewingSchedule':
                    return $this->createViewingSchedule($parsedData, $userId, $botReply);
                case 'deleteViewingSchedule':
                    return $this->deleteViewingSchedule($parsedData, $userId);
                default:
                    break;
            }
        }

        // Lưu và trả nội dung nếu không có action
        $content = $botReply['choices'][0]['message']['content'];
        $this->addHistory($content, 'assistant', $userId);

        return response()->json([
            'success' => true,
            'reply' => $botReply['choices'][0]['message']['content'] ?? $parsedData,
            'replyDetail' => $content,
            'history' => $this->getUserHistory($userId),
        ]);
    }

    /**
     * Lưu lịch sử chat
     */
    private function addHistory($content, $role, $userId)
    {
        ChatHistory::create([
            'user_id' => $userId,
            'role' => $role,
            'content' => $content,
        ]);
    }

    /**
     * Parse JSON từ AI
     */
    private function parseChatbotContent(string $content): ?array
    {
        $decoded = json_decode(trim($content), true);
        return json_last_error() === JSON_ERROR_NONE ? $decoded : null;
    }

    /**
     * Lấy lịch sử chat của user (trừ system)
     */
    private function getUserHistory($userId)
    {
        return ChatHistory::where('user_id', $userId)
            ->where('role', '!=', 'system')
            ->orderBy('created_at')
            ->get(['role', 'content', 'product'])
            ->map(fn($item) => [
                'role' => $item->role,
                'content' => $item->content,
                'product' => json_decode($item->product ?? '[]', true),
            ]);
    }

    /**
     * Tìm kiếm phòng dựa trên filter
     */
    private function searchRoom($filters, $userId, $reply)
    {
        // return response()->json([
        //     'replyDetail' => $filters,
        //     'history' => $this->getUserHistory($userId),
        // ]);
        $location = $filters['location'] ?? null;
        $TaDo = $this->getCoordinatesFromLandmarks($location);

        $perPage = 100;
        $results = $this->searchNearby($filters, $TaDo, $perPage);

        if ($results->isNotEmpty()) {
            $data = $results->toArray()['data'] ?? $results->toArray();

            ChatHistory::create([
                'user_id' => $userId,
                'role' => 'assistant',
                'content' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp:',
                'history' => $this->getUserHistory($userId),
            ]);
        } else {
            $this->addHistory('Không tìm thấy kết quả phù hợp với yêu cầu của bạn.', 'assistant', $userId);
            return response()->json([
                'reply' => $reply,
                'message' => 'Không tìm thấy kết quả phù hợp với yêu cầu của bạn.',
                'history' => $this->getUserHistory($userId),
            ]);
        }
    }

    /**
     * Tra cứu tọa độ từ landmarks đã có
     */
    private function getCoordinatesFromLandmarks($location)
    {
        $landmarks = Cache::remember('landmarks_latlng', 3600 * 24, function () {
            $file = base_path('config/apps/data_AI/dia_danh_noi_tieng.jsonl');
            return json_decode(file_get_contents($file), true);
        });

        foreach ($landmarks['landmarks'] ?? [] as $lm) {
            if (stripos($lm['name'], $location) !== false || stripos($lm['location'], $location) !== false) {
                return ['lat' => $lm['lat'] ?? null, 'lon' => $lm['lon'] ?? null];
            }
        }

        // Fallback sang geocode nếu không tìm thấy
        return $this->getCoordinatesFromAddress($location);
    }

    /**
     * Lấy tọa độ từ API Nominatim (fallback)
     */
    private function getCoordinatesFromAddress($address)
    {
        if (!$address)
            return null;

        return Cache::remember("geocode_" . md5($address), 3600 * 24, function () use ($address) {
            $url = 'https://nominatim.openstreetmap.org/search?q=' . urlencode($address) . '&format=json&limit=1';
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_USERAGENT, 'MyGeocoderApp/1.0 (haohao051103@gmail.com)');
            $response = curl_exec($ch);
            curl_close($ch);
            $data = json_decode($response, true);

            return !empty($data) ? ['lat' => $data[0]['lat'], 'lon' => $data[0]['lon']] : null;
        });
    }
    public function searchNearby(array $filters, $TaDo, $perPage = 200)
    {
        // dd($filters,$TaDo);
        $lat = $TaDo['lat'] ?? null;
        $lng = $TaDo['lon'] ?? null;
        $radius = $filters['radius'] ?? 1; // km

        // Lấy danh sách căn hộ đã đặt (trừ khi Check_out)
        $bookedIds = RentalOrder::where('status', '!=', 'Check_out')
            ->pluck('apartment_id')
            ->toArray();

        // Query chính
        $query = Apartment::with('images') // 👈 thêm dòng này
            ->join('buildings', 'apartments.building_id', '=', 'buildings.id')
            ->select('apartments.*', 'buildings.lat', 'buildings.lng')
            ->selectRaw('(6371 * acos(
        cos(radians(?)) * cos(radians(buildings.lat)) *
        cos(radians(buildings.lng) - radians(?)) +
        sin(radians(?)) * sin(radians(buildings.lat))
    )) AS distance', [$lat, $lng, $lat])
            ->where('apartments.status', 'available')
            ->whereNotIn('apartments.id', $bookedIds)
            ->whereNotNull('buildings.lat')
            ->whereNotNull('buildings.lng');


        // Lọc theo giá
        if (!empty($filters['price_min'])) {
            $query->where('apartments.price', '>=', (float) $filters['price_min'] * 1_000_000);
        }
        if (!empty($filters['price_max'])) {
            $query->where('apartments.price', '<=', (float) $filters['price_max'] * 1_000_000);
        }

        // Lọc theo khoảng cách
        if (!is_null($lat) && !is_null($lng)) {
            $query->having('distance', '<=', $radius)
                ->orderBy('distance', 'asc');
        }

        return $query->paginate($perPage);
    }

    public function searchApartment($filters, $userId, $reply)
    {
        $list = $this->Apartment->search($filters);
        if ($list->isNotEmpty()) {
            $data = $list->toArray()['data'] ?? $list->toArray();
            ChatHistory::create([
                'user_id' => $userId,
                'role' => 'assistant',
                'content' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp:',
                'history' => $this->getUserHistory($userId),
            ]);
        } else {
            $this->addHistory('Không tìm thấy kết quả phù hợp với yêu cầu của bạn.', 'assistant', $userId);
            return response()->json([
                'reply' => $reply,
                'message' => 'Không tìm thấy kết quả phù hợp với yêu cầu của bạn.',
                'history' => $this->getUserHistory($userId),
            ]);
        }
    }
    public function findApartmentByName($filters, $userId, $reply)
    {
        $list = $this->building->searchName($filters);
        if ($list->isNotEmpty()) {
            $data = $list->toArray()['data'] ?? $list->toArray();
            ChatHistory::create([
                'user_id' => $userId,
                'role' => 'assistant',
                'content' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['mess'] ?? 'Đây là một số phòng trọ phù hợp:',
                'history' => $this->getUserHistory($userId),
            ]);
        } else {
            $this->addHistory('Không tìm thấy kết quả phù hợp với yêu cầu của bạn.', 'assistant', $userId);
            return response()->json([
                'reply' => $reply,
                'message' => 'Không tìm thấy kết quả phù hợp với yêu cầu của bạn.',
                'history' => $this->getUserHistory($userId),
            ]);
        }
    }
    //đặt lịch xem phòng 
    public function createViewingSchedule(array $filters, $userId, $reply)
    {
        try {
            $user = auth()->user();

            // ✅ 1. Kiểm tra dữ liệu đầu vào
            if (empty($filters['date']) || empty($filters['apartment_id'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Thiếu dữ liệu bắt buộc (date hoặc apartment_id)!',
                    'data' => $filters,
                ], 422);
            }

            // ✅ 2. Kiểm tra ngày hợp lệ
            $date = date('Y-m-d H:i:s', strtotime($filters['date']));
            if (strtotime($date) < strtotime(date('Y-m-d'))) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ngày đặt lịch phải từ hôm nay trở đi!',
                ], 422);
            }

            // ✅ 3. Kiểm tra lịch trùng
            $exists = ViewingSchedule::where('user_id', $user->id)
                ->where('apartment_id', $filters['apartment_id'])
                ->where('status', 'pending')
                ->with('apartment')
                ->first();

            if ($exists) {
                $apartment = $exists->apartment;
                $this->addHistory(
                    "Bạn đã đặt lịch xem cho căn hộ {$apartment->address} (Mã: {$apartment->id}) này rồi.  
                Nếu bạn muốn thay đổi lịch, vui lòng hủy lịch hiện tại và đặt lại lịch mới.  
                Tôi có thể giúp bạn hủy lịch hiện tại nếu bạn muốn!",
                    'assistant',
                    $userId
                );

                return response()->json([
                    'success' => true,
                    'message' => 'Bạn đã đặt lịch cho căn hộ này vào ngày này rồi!',
                    'history' => $this->getUserHistory($userId),
                ], 200);
            }
            // ✅ 4. Tạo lịch mới (thêm hạn cuối)
            $scheduledAt = date('Y-m-d H:i:s', strtotime($filters['date']));

            // 👉 Tính hạn cuối (deadline = scheduled_at + 2 ngày)
            $deadline = date('Y-m-d H:i:s', strtotime($scheduledAt . ' +2 days'));

            // ✅ 4. Tạo lịch mới
            $booking = $this->bookingService->create([
                'scheduled_at' => $date,
                'user_id' => $user->id,
                'apartment_id' => $filters['apartment_id'],
                'status' => 'pending',
                'deadline' => $deadline,
                'note' => $filters['note'] ?? null,
            ]);

            // ✅ 5. Lấy thông tin căn hộ
            $apartment = Apartment::with('building.owner')->find($filters['apartment_id']);
            if (!$apartment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy căn hộ này trong hệ thống!',
                ], 404);
            }

            // ✅ 6. Chuẩn bị dữ liệu gửi email
            $list = [
                'name_user' => $user->name,
                'owner_name' => optional(optional($apartment->building)->owner)->name,
                'address' => $apartment->address,
                'building' => optional($apartment->building)->name,
                'phone_owner' => optional(optional($apartment->building)->owner)->phone,
                'customer_name' => $user->name,
                'date' => $date,
                'time' => date('H:i', strtotime($date)),
                'price' => number_format((float) preg_replace('/[^0-9.]/', '', $apartment->price), 0, ',', '.') . ' VNĐ',
                'note' => $filters['note'] ?? 'Không có ghi chú',
                'map_link' => 'https://maps.google.com/?q=' . urlencode(optional($apartment->building)->address),
                'year' => date('Y'),
                'email_owner' => optional(optional($apartment->building)->owner)->email,
                'email_user' => $user->email,
            ];

            // ✅ 7. Gửi email nếu có đủ email
            if (!empty($list['email_owner']) && !empty($list['email_user'])) {
                Mail::send(new EmailViewingSchedule($list));
            }
            // ✅ 8. Lưu vào lịch sử chat
            ChatHistory::create([
                'user_id' => $userId,
                'role' => 'assistant',
                'content' => $filters['mess'] ?? 'Đặt lịch xem phòng thành công! Cảm ơn bạn đã sử dụng dịch vụ.',
            ]);
            //thông báo
            pushNotification(
                $apartment->building->owner_id,
                "Bạn vừa nhận được một lịch hẹn xem phòng tại {$apartment->address} vào ngày {$date}. Vui lòng kiểm tra và xác nhận.",
                "success", // hoặc "success", "info", "warning"
                "/schedule/$booking->id"
            );
            $this->notification->create([
                "user_id" => $apartment->building->owner_id,
                "title" => "Thông báo lịch xem phòng",
                "message" => "Bạn vừa nhận được một lịch hẹn xem phòng tại {$apartment->address} vào ngày {$date}. Vui lòng kiểm tra và xác nhận.",
                "status" => "unread",
                "url" => "/schedule/$booking->id"
            ]);

            // ✅ 9. Trả kết quả
            return response()->json([
                'success' => true,
                'message' => 'Đặt lịch xem phòng thành công!',
                'filters' => $filters['mess'],
                'data' => [
                    'booking' => $booking,
                    'apartment' => $apartment,
                ],
                'history' => $this->getUserHistory($userId),
            ], 200);

        } catch (\Exception $e) {
            // ✅ 10. Log lỗi + phản hồi
            \Log::error('Booking failed: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'filters' => $filters,
                'trace' => $e->getTraceAsString(),
            ]);

            $this->addHistory('Đã xảy ra lỗi khi đặt lịch xem phòng, vui lòng thử lại sau!', 'assistant', $userId);

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi hệ thống trong quá trình đặt lịch!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function deleteViewingSchedule(array $filters, $userId)
    {
        $apartment_id = $filters['apartment_id'] ?? null;
        $user_id = auth()->id();

        if (!$apartment_id || !$user_id) {
            return response()->json([
                'success' => false,
                'message' => 'Thiếu dữ liệu cần thiết để hủy lịch xem phòng!',
            ], 422);
        }

        try {
            $schedule = ViewingSchedule::where('apartment_id', $apartment_id)
                ->where('user_id', $user_id)
                ->where('status', 'pending') // chỉ hủy lịch đang chờ
                ->first();

            if (!$schedule) {
                $this->addHistory("Không tìm thấy lịch đang chờ để hủy.", 'assistant', $userId);
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy lịch xem phòng đang chờ để hủy!',
                ]);
            }

            $schedule->update(['status' => 'cancelled']);

            $this->addHistory(
                "Lịch xem phòng tại căn hộ ID {$apartment_id} đã được hủy thành công.",
                'assistant',
                $userId
            );
            //thông báo
            pushNotification(
                $schedule->apartment->building->owner_id,
                "Lịch hẹn xem phòng tại {$schedule->apartment->address} vào ngày {$schedule->date} đã bị hủy.",
                "error", // hoặc "success", "info", "warning"
                "/schedule/$schedule->id"
            );
            $this->notification->create([
                "user_id" => $schedule->apartment->building->owner_id,
                "title" => "Thông báo lịch xem phòng",
                "message" => "Lịch hẹn xem phòng tại {$schedule->apartment->address} vào ngày {$schedule->date} đã bị hủy.",
                "status" => "unread",
                "url" => "/schedule/$schedule->id"
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Đã hủy lịch xem phòng thành công!',
                'data' => $schedule,
                'history' => $this->getUserHistory($userId),
              
            ], 200);

        } catch (\Throwable $e) {
            \Log::error('Cancel schedule failed: ' . $e->getMessage(), [
                'filters' => $filters,
                'user_id' => $user_id,
            ]);

            $this->addHistory("Xảy ra lỗi khi hủy lịch xem phòng, vui lòng thử lại sau.", 'assistant', $userId);

            return response()->json([
                'success' => false,
                'message' => 'Xảy ra lỗi khi hủy lịch xem phòng!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
