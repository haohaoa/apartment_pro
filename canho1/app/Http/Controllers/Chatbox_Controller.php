<?php
namespace App\Http\Controllers;

use App\Models\Apartment;
use App\Models\Building;
use App\Models\ChatHistory;
use App\Models\RentalOrder;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use Doctrine\Common\Lexer\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class Chatbox_Controller extends Controller
{
    protected $Apartment;
    protected $building;

    public function __construct(ApartmentRepositoryInterface $apartmentRepo, BuildingRepositoryInterface $buildingRepository)
    {
        $this->Apartment = $apartmentRepo;
        $this->building = $buildingRepository;

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
            'ai_agent.jsonl'
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
            ]);

        if ($response->successful()) {
            $botReply = $response->json()['choices'][0]['message']['content'] ?? '';
            // return $botReply;
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
    private function handleBotReply(string $botReply, $userId, $chatHistory, $retryCount = 0)
    {
        $parsedData = $this->parseChatbotContent($botReply);

        if (!is_array($parsedData) || !isset($parsedData['content'])) {
            $chatHistory[] = ['role' => 'user', 'content' => 'Phản hồi sai định dạng JSON, yêu cầu trả lại đúng JSON.'];
            return $this->callAI($chatHistory, $userId, $retryCount);
        }

        if (isset($parsedData['action'])) {
            switch ($parsedData['action']) {
                case 'findNearbyApartment':
                    return $this->searchRoom($parsedData, $userId, $botReply);
                case 'searchApartment':
                    // Tìm căn hộ theo quận/phường/tên đường
                    return $this->searchApartment($parsedData, $userId, $botReply);
                case 'findApartmentByName':
                    // Tìm căn hộ theo tên cụ thể
                    return $this->findApartmentByName($parsedData, $userId, $botReply);
                default:
                    break;
            }
        }

        // Lưu và trả nội dung nếu không có action
        $content = $parsedData['content'];
        $this->addHistory($content, 'assistant', $userId);

        return response()->json([
            'reply' => $content,
            'replyDetail' => $botReply,
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
        $location = $filters['parameters']['location'] ?? null;
        $TaDo = $this->getCoordinatesFromLandmarks($location);

        $perPage = 100;
        $results = $this->searchNearby($filters['parameters'], $TaDo, $perPage);

        if ($results->isNotEmpty()) {
            $data = $results->toArray()['data'] ?? $results->toArray();

            ChatHistory::create([
                'user_id' => $userId,
                'role' => 'assistant',
                'content' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp:',
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
                'content' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp:',
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
                'content' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp với yêu cầu của bạn:',
                'product' => json_encode($data, JSON_UNESCAPED_UNICODE),
            ]);

            return response()->json([
                'reply' => $reply,
                'message' => $filters['content'] ?? 'Đây là một số phòng trọ phù hợp:',
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
    // test
    // public function testSearch(Request $request)
    // {
    //     $lat = $request->input('lat');
    //     $lng = $request->input('lng');
    //     $radius = $request->input('radius', 5); // km
    //     $priceMin = $request->input('price_min');
    //     $priceMax = $request->input('price_max');
    //     $location = $request->input('location');

    //     // Lấy danh sách căn hộ đã đặt (trừ khi Check_out)
    //     $bookedIds = RentalOrder::where('status', '!=', 'Check_out')
    //         ->pluck('apartment_id')
    //         ->toArray();

    //     // Query chính
    //     $query = Apartment::join('buildings', 'apartments.building_id', '=', 'buildings.id')
    //         ->select('apartments.*', 'buildings.lat', 'buildings.lng')
    //         ->selectRaw('(6371 * acos(
    //             cos(radians(?)) * cos(radians(buildings.lat)) *
    //             cos(radians(buildings.lng) - radians(?)) +
    //             sin(radians(?)) * sin(radians(buildings.lat))
    //         )) AS distance', [$lat, $lng, $lat])
    //         ->where('apartments.status', 'available')
    //         ->whereNotIn('apartments.id', $bookedIds)
    //         ->whereNotNull('buildings.lat')
    //         ->whereNotNull('buildings.lng')
    //         ->having('distance', '<=', $radius)
    //         ->orderBy('distance', 'asc');

    //     // Lọc theo địa chỉ tòa nhà
    //     if (!empty($location)) {
    //         $query->where('buildings.address', 'LIKE', "%{$location}%");
    //     }

    //     // Lọc theo giá
    //     if (!empty($priceMin)) {
    //         $query->where('apartments.price', '>=', (float) $priceMin * 1_000_000);
    //     }
    //     if (!empty($priceMax)) {
    //         $query->where('apartments.price', '<=', (float) $priceMax * 1_000_000);
    //     }

    //     $results = $query->paginate(10);

    //     return response()->json([
    //         'count' => $results->total(),
    //         'current_page' => $results->currentPage(),
    //         'per_page' => $results->perPage(),
    //         'data' => $results->items(),
    //     ]);
    // }

}
