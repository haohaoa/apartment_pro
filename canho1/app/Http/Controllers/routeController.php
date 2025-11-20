<?php
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Mail\EmailViewingSchedule;
use App\Models\Apartment;
use App\Models\Building;
use App\Models\ChatHistory;
use App\Models\Payment;
use App\Models\RentalOrder;
use App\Models\ViewingSchedule;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\NotificationRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\ViewingSchedulesRepositoryInterface;
use Illuminate\Http\Request;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use Log;
use Illuminate\Support\Facades\DB;
use Validator;

class routeController extends Controller
{

    protected $SearchApartment;
    protected $bookingService;
    protected $userRepostory;
    protected $notification;
    protected $viewingService;
    protected $buildingService;
    public function __construct(
        ApartmentRepositoryInterface $search,
        ViewingSchedulesRepositoryInterface $data,
        UserRepositoryInterface $user,
        NotificationRepositoryInterface $notification,
        ViewingSchedulesRepositoryInterface $viewingSchedulesRepository,
        BuildingRepositoryInterface $Building
    ) {
        $this->SearchApartment = $search;
        $this->bookingService = $data;
        $this->userRepostory = $user;
        $this->notification = $notification;
        $this->viewingService = $viewingSchedulesRepository;
        $this->buildingService = $Building;
    }

    public function getChatApi(Request $request)
    {
        return response()->json([
            'history' => ChatHistory::where('user_id', $request->user()->id)
                ->where('role', '!=', 'system')
                ->orderBy('created_at')
                ->get(['role', 'content', 'product']) // chỉ lấy cột
                ->map(function ($item) {
                    return [
                        'role' => $item->role,
                        'content' => $item->content,
                        'product' => json_decode($item->product ?? '[]', true),
                    ];
                }),
        ]);
    }

    public function getPhone(Request $request)
    {
        $phone = User::where('id', $request->id)->get('phone');

        return response()->json([
            'phone' => $phone,
            'message' => true,
        ]);
    }
    public function getApartment($id)
    {
        $apartments = $this->SearchApartment->find($id);
        return response()->json([
            'apartment' => $apartments,
            'success' => true,
        ]);
    }

    public function searchApartment(Request $request)
    {
        $location = implode(', ', array_filter([
            $request->input('ward'),
            $request->input('district'),
            $request->input('city'),
        ]));
        $filters = [
            'parameters' => [
                'location' => $location,
                'price_min' => $request->input('price_min'),
                'price_max' => $request->input('price_max'),
                'bedrooms' => $request->input('bedrooms'),
            ],
        ];
        // dd($filters);
        $perPage = 10;
        $apartments = $this->SearchApartment->search($filters, $perPage);
        return response()->json($apartments);
    }


    public function booking(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date|after_or_equal:today',
            'apartment_id' => 'required|exists:apartments,id',
            'note' => 'nullable|string|max:500',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false,
            ], 422);
        }

        try {
            $user_id = auth()->id();
            $exists = ViewingSchedule::where('user_id', $user_id)
                ->where('apartment_id', $request->apartment_id)
                ->whereDate('scheduled_at', $request->date)
                ->where('status', 'pending')
                ->exists();


            if ($exists) {
                return response()->json([
                    'message' => 'Bạn đã đặt lịch cho căn hộ này vào ngày này rồi!',
                    'success' => false,
                    'dtda' => $exists,
                ], 409); // Conflict
            }
            $scheduledAt = date('Y-m-d H:i:s', strtotime($request->date));

            // 👉 Tính hạn cuối (deadline = scheduled_at + 2 ngày)
            $deadline = date('Y-m-d H:i:s', strtotime($scheduledAt . ' +2 days'));

            $thongbao = $this->bookingService->create([
                'scheduled_at' => $request->date,
                'user_id' => $user_id,
                'apartment_id' => $request->apartment_id,
                'status' => 'pending',
                'deadline' => $deadline,
                'note' => $request->note
            ]);

            // Gửi thông báo cho người dùng
            $data = Apartment::where('id', $request->apartment_id)
                ->with('building.owner')
                ->first();

            $list = [
                'name_user' => auth()->user()->name,
                'owner_name' => optional(optional($data->building)->owner)->name,
                'address' => $data->address,
                'building' => optional($data->building)->name,
                'phone_owner' => optional(optional($data->building)->owner)->phone,
                'customer_name' => auth()->user()->name,
                'date' => $request->date,
                'time' => date('H:i', strtotime($request->date)),
                'price' => number_format((float) preg_replace('/[^0-9.]/', '', $data->price), 0, ',', '.') . ' VNĐ',
                'note' => $request->note ?? 'Không có ghi chú',
                'map_link' => 'https://maps.google.com/?q=' . urlencode($data->building->address),
                'year' => date('Y'),
                'email_owner' => optional(optional($data->building)->owner)->email,
                'email_user' => auth()->user()->email,
            ];


            Mail::send(new EmailViewingSchedule($list));

            pushNotification(
                $data->building->owner->id,
                "Bạn vừa nhận được một lịch hẹn xem phòng tại {$data->address} vào ngày {$request->date}. Vui lòng kiểm tra và xác nhận.",
                "success",// hoặc "success", "info", "warning",
                "/schedule/$thongbao->id"
            );
            $this->notification->create([
                "user_id" => $data->building->owner->id,
                "title" => "Thông báo lịch xem phòng",
                "message" => "Bạn vừa nhận được một lịch hẹn xem phòng tại {$data->address} vào ngày {$request->date}. Vui lòng kiểm tra và xác nhận.",
                "status" => "unread",
                "url" => "/schedule/$thongbao->id"
            ]);
            return response()->json([
                'message' => 'đặt lịch thành công',
                'success' => true,
            ], 201);

        } catch (\Exception $e) {
            \Log::error('Booking failed: ' . $e->getMessage(), [
                'user_id' => auth()->id(),
                'request_data' => $request->all(),
            ]);

            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage(),
                'success' => false,
                'return' => $data
            ], 500);
        }
    }

    public function getViewingSchedules()
    {
        try {
            $userId = auth()->id();

            if (!$userId) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized. User not authenticated.',
                    'data' => null,
                ], 401);
            }

            $schedules = $this->bookingService->all($userId);

            return response()->json([
                'success' => true,
                'message' => 'Viewing schedules retrieved successfully.',
                'data' => $schedules,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resource not found: ' . $e->getMessage(),
                'data' => null,
            ], 404);

        } catch (\Exception $e) {
            \Log::error('Error fetching viewing schedules', [
                'user_id' => auth()->id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Internal server error. Please try again later.',
                'data' => null,
            ], 500);
        }
    }
    public function cancel($id)
    {
        try {
            // Lấy lịch theo id
            $schedule = $this->bookingService->find($id);

            // Kiểm tra quyền với Policy
            $this->authorize('cancel', $schedule);

            // Nếu pass, cập nhật trạng thái
            $schedule = $this->bookingService->update($id, [
                'status' => 'cancelled',
            ]);

            // Tạo thông báo
            $this->notification->create([
                "user_id" => $schedule->apartment->building->owner_id,
                "title" => "Thông báo hủy lịch xem phòng",
                "message" => "Lịch hẹn xem phòng tại {$schedule->apartment->address} vào ngày {$schedule->date} đã bị hủy.",
                "status" => "unread",
                "url" => "/schedule/$schedule->id"
            ]);

            // Gửi thông báo SSE
            pushNotification(
                $schedule->apartment->building->owner_id,
                "Lịch hẹn xem phòng tại {$schedule->apartment->address} vào ngày {$schedule->date} đã bị hủy.",
                "error", // hoặc "success", "info", "warning"
                "/schedule/$schedule->id"
            );


            return response()->json([
                'success' => true,
                'message' => 'Lịch xem phòng đã được hủy thành công.',
                'data' => $schedule,
            ], 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'AUTHORIZATION_DENIED',
                    'message' => 'Bạn không có quyền hủy lịch này.',
                    'details' => $e->getMessage(),
                ]
            ], 403);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'CANCEL_FAILED',
                    'message' => 'Hủy lịch xem thất bại.',
                    'details' => $e->getMessage(),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                ]
            ], 500);
        }
    }
    public function getBookingById($id)
    {
        try {
            $schedule = $this->bookingService->find($id);

            // Kiểm tra quyền với Policy
            $this->authorize('view', $schedule);

            return response()->json([
                'message' => 'Lấy thông tin lịch xem phòng thành công.',
                'data' => $schedule,
                'success' => true,
            ], 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            // Nếu user không có quyền
            return response()->json([
                'message' => 'Bạn không có quyền xem lịch này.',
                'success' => false,
            ], 403);

        } catch (\Exception $e) {
            // Nếu lỗi khác
            return response()->json([
                'message' => 'Lấy thông tin lịch xem thất bại.',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    public function updateSignature(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'signature' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
                'success' => false,
            ], 422);
        }

        try {
            // Cập nhật chữ ký cho user hiện tại
            $user = $this->userRepostory->update(auth()->user()->id, [
                'signature' => $request->input('signature'),
            ]);

            return response()->json([
                'message' => 'Cập nhật chữ ký thành công',
                'data' => $user,
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Đã xảy ra lỗi khi cập nhật chữ ký',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }

    public function getSignature(Request $request)
    {
        $user = $this->userRepostory->find(auth()->user()->id);
        return response()->json([
            'message' => 'Lấy chữ ký thành công',
            'data' => $user,
            'success' => true,
        ]);
    }

    public function getOwnerPayment(Request $request)
    {
        try {
            // ✅ 1. Validate input
            $validated = $request->validate([
                'id' => 'required|integer|exists:payments,id',
            ]);

            // ✅ 2. Lấy dữ liệu thanh toán
            $payment = Payment::select('id', 'amount', 'status', 'rental_order_id', 'period_start', 'period_end', 'month')
                ->with([
                    'rentalOrder' => function ($query) {
                        $query->select('id', 'apartment_id', 'owner_id', 'user_id');
                    },
                    'rentalOrder.owner' => function ($query) {
                        $query->select('id', 'name', 'email', 'bank_name', 'bank_account_number'); // ẩn mật khẩu, token, v.v.
                    },
                    'rentalOrder.contract' => function ($query) { // ✅ dùng chữ thường
                        $query->select('id', 'rental_order_id', 'monthly_rent', 'landlord_data', 'apartment_address');
                    },
                ])
                ->where('id', $validated['id'])
                ->first();


            // ✅ 3. Nếu không tìm thấy
            if (!$payment) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy thông tin thanh toán!',
                ], 404);
            }

            // ✅ 4. Trả về kết quả thành công
            return response()->json([
                'success' => true,
                'message' => 'Lấy thông tin thanh toán thành công!',
                'data' => $payment,
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // ✅ 5. Lỗi validate
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ!',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // ✅ 6. Lỗi hệ thống khác
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy thông tin thanh toán!',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function getScheduleOwner()
    {
        try {
            $ownerId = auth()->id();

            // Lấy danh sách lịch xem căn hộ của chủ nhà
            $data = $this->viewingService->allOwner($ownerId);

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Không có lịch xem căn hộ nào cho chủ nhà này.',
                    'data' => [],
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách lịch xem căn hộ thành công!',
                'data' => $data,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách lịch xem căn hộ.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
     public function getScheduleAdmin()
    {
        try {

            // Lấy danh sách lịch xem căn hộ của chủ nhà
            $data = $this->viewingService->allAdmin();

            if ($data->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Không có lịch xem căn hộ nào cho chủ nhà này.',
                    'data' => [],
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Lấy danh sách lịch xem căn hộ thành công!',
                'data' => $data,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy danh sách lịch xem căn hộ.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function getScheduleOwnerDetail($id)
    {
        try {
            // Lấy chi tiết lịch xem
            $schedule = $this->viewingService->find($id);

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy lịch xem căn hộ.',
                ], 404);
            }

            // Kiểm tra quyền của chủ sở hữu
            $this->authorize('viewOwner', $schedule);

            return response()->json([
                'success' => true,
                'message' => 'Lấy chi tiết lịch xem căn hộ thành công!',
                'data' => $schedule,
            ], 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            // Lỗi phân quyền
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền xem lịch này.',
            ], 403);

        } catch (\Exception $e) {
            // Lỗi hệ thống
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi lấy chi tiết lịch xem căn hộ.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
    public function cancelSchedule($id)
    {
        try {
            // Lấy chi tiết lịch xem
            $schedule = $this->viewingService->find($id);

            if (!$schedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy lịch xem căn hộ.',
                ], 404);
            }

            // Kiểm tra quyền của chủ sở hữu
            $this->authorize('updateOwner', $schedule);

            // Cập nhật trạng thái hủy
            $updatedSchedule = $this->viewingService->update($id, [
                'status' => 'cancelled', // thống nhất tên status với DB
            ]);

            pushNotification(
                $schedule->user_id,
                "Lịch xem phòng tại {$schedule->apartment->address} vào {$schedule->scheduled_at} đã bị hủy bởi chủ sở hữu.",
                "error",
                "/dashboard"
            );
            $this->notification->create([
                "user_id" => $schedule->user_id,
                "title" => "Thông báo lịch xem phòng",
                "message" => "Lịch xem phòng tại {$schedule->apartment->address} vào {$schedule->scheduled_at} đã bị hủy bởi chủ sở hữu.",
                "status" => "unread",
                "url" => null
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Hủy lịch xem căn hộ thành công!',
                'data' => $updatedSchedule, // trả dữ liệu đã update
            ], 200);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            // Lỗi phân quyền
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền hủy lịch này.',
            ], 403);

        } catch (\Exception $e) {
            // Lỗi hệ thống
            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi khi hủy lịch xem căn hộ.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function markAsPaid(Request $request, $id)
    {
        // 1️⃣ Tìm payment theo ID
        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bản ghi thanh toán.',
            ], 404);
        }

        $order = $payment->rentalOrder;
        // 2️⃣ Kiểm tra quyền với try/catch
        try {
            $this->authorize('updatePayment', $order);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }

        // 3️⃣ Cập nhật trạng thái
        $price = $payment->rentalOrder->Contract->monthly_rent;
        $payment->status = 'pending_confirmation'; // khách đã thanh toán, chờ chủ xác nhận
        $payment->payment_date = now();
        $payment->amount = $price;
        $payment->method = $request->input('method', 'bank');
        $payment->save();

        // 4️⃣ Gửi thông báo đến chủ nhà
        $landlordId = $payment->rentalOrder->owner_id;
        $period = $payment->month . '/' . $payment->year;
        $amount = number_format($payment->amount, 0, ',', '.');
        $id = $payment->rentalOrder->id;
        $message = "Khách hàng đã thực hiện thanh toán kỳ {$period} với số tiền {$amount}₫. Vui lòng kiểm tra và xác nhận.";

        pushNotification(
            $landlordId,
            $message,
            "info",
            "/contracts/$id"
        );

        $this->notification->create([
            "user_id" => $landlordId,
            "title" => "Thanh toán mới từ khách hàng",
            "message" => $message,
            "status" => "unread",
            "url" => "/contracts/$id"
        ]);

        // 5️⃣ Trả về kết quả
        return response()->json([
            'success' => true,
            'message' => 'Cập nhật trạng thái thanh toán thành công.',
        ]);
    }
    public function confirmPayment($id)
    {

        $payment = Payment::find($id);

        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Không tìm thấy bản ghi thanh toán hoặc đơn hàng liên quan.',
            ], 404);
        }

        $order = $payment->rentalOrder;

        // 2️⃣ Kiểm tra quyền: chỉ chủ nhà của đơn hàng mới xác nhận
        try {
            $this->authorize('updatePaymentOwner', $order);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }

        // 3️⃣ Chỉ xác nhận những payment đang chờ confirmation
        if ($payment->status !== 'pending_confirmation') {
            return response()->json([
                'success' => false,
                'message' => 'Thanh toán này không cần xác nhận hoặc đã được xác nhận.',
            ], 400);
        }

        // 4️⃣ Cập nhật trạng thái
        $payment->status = 'paid';
        $payment->save();

        // 5️⃣ Gửi thông báo cho khách hàng
        $tenantId = $order->user_id; // giả sử order có tenant_id
        $period = $payment->month . '/' . $payment->year;
        $amount = number_format($payment->amount, 0, ',', '.');

        $message = "Thanh toán kỳ {$period} với số tiền {$amount}₫ của bạn đã được chủ nhà xác nhận thành công.";

        pushNotification(
            $tenantId,
            $message,
            "success",
            "/dashboard "// link đến chi tiết hợp đồng
        );

        $this->notification->create([
            'user_id' => $tenantId,
            'title' => 'Thanh toán đã được xác nhận',
            'message' => $message,
            'status' => 'unread',
            'url' => "/dashboard"
        ]);

        // 6️⃣ Trả về kết quả
        return response()->json([
            'success' => true,
            'message' => 'Xác nhận thanh toán thành công.',
            'data' => $payment,
        ]);
    }

    public function getDashboard()
    {
        $id = auth()->id();

        $userWithBuildings = Building::where('owner_id', $id)
            ->count();
        $rentedApartments = $this->buildingService->getAllBuilding($id);
        $recentContracts = RentalOrder::whereHas('apartment', function ($query) use ($id) {
            $query->whereHas('building', function ($q) use ($id) {
                $q->where('owner_id', $id);
            });
        })
            // ->with('Contract')
            ->take(5)
            ->get();
        $monthlyRevenueRaw = Payment::whereHas('RentalOrder', function ($query) use ($id) {
            $query->whereHas('apartment', function ($q) use ($id) {
                $q->whereHas('building', function ($c) use ($id) {
                    $c->where('owner_id', $id);
                });
            });
        })
            ->whereYear('period_start', now()->year)
            ->selectRaw('MONTH(period_start) as month, SUM(amount) as total')
            ->groupByRaw('MONTH(period_start)')
            ->orderByRaw('MONTH(period_start)')
            ->get();

        $monthlyRevenue = collect(range(1, 12))->mapWithKeys(function ($m) use ($monthlyRevenueRaw) {
            return [$m => $monthlyRevenueRaw->firstWhere('month', $m)->total ?? 0];
        });

        // Tháng hiện tại và tháng trước
        $currentMonth = now()->month;
        $lastMonth = now()->subMonth()->month;

        // Tăng trưởng so với tháng trước
        $growth = 0;
        if ($monthlyRevenue[$lastMonth] > 0) {
            $growth = (($monthlyRevenue[$currentMonth] - $monthlyRevenue[$lastMonth])
                / $monthlyRevenue[$lastMonth]) * 100;
        }

        $growth = round($growth, 2);
        return response()->json([
            'userWithBuildings' => $userWithBuildings,
            'rentedApartments' => $rentedApartments,
            'recentContracts' => $recentContracts,
            'monthly_revenue' => $monthlyRevenue,
            'current_month_growth' => $growth,
        ]);
    }

    public function getallUser()
    {
        $U = auth()->user();
        try {
            $this->authorize('view', $U);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }
        $users = User::all();
        return response()->json([
            'users' => $users,
            'success' => true,
        ]);
    }
    public function getByIdUser($id)
    {
        $U = auth()->user();
        try {
            $this->authorize('view', $U);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }
        $users = User::find($id);
        return response()->json([
            'users' => $users,
            'success' => true,
        ]);
    }

    public function deleteUser($id)
    {
        $U = auth()->user();
        try {
            $this->authorize('delete', $U);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User không tồn tại'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User đã bị xóa'
        ], 200);
    }

    // Cập nhật thông tin căn hộ

    public function updateUser(Request $request, $id)
    {
        
        $U = auth()->user();
        try {
            $this->authorize('update', $U);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        }
        // Tìm user cần update
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User không tồn tại'
            ], 404);
        }

        // Validation
        $request->validate([
            'name' => 'sometimes|string|max:255',
            // 'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'sometimes|string|min:6|nullable',
            'phone' => 'nullable|string|max:20',
            'role' => 'sometimes|in:tenant,owner,admin',
            'signature' => 'nullable|string',
            'idCard' => 'nullable|string|max:255',
            'birthDate' => 'nullable|date',
            'verification_code' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'bank_account_number' => 'nullable|string|max:50'
        ]);

        // Update password nếu có
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        // Update các field còn lại
        $user->fill($request->only([
            'name',
            'email',
            'phone',
            'role',
            'signature',
            'idCard',
            'birthDate',
            'verification_code',
            'bank_name',
            'bank_account_number'
        ]));

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thông tin user thành công.',
            'user' => $user
        ], 200);
    }
    public function blockUser(Request $request, $id)
    {
        $currentUser = auth()->user();

        // Tìm user cần khóa
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User không tồn tại'
            ], 404);
        }

        // Chỉ admin mới được khóa user
        if ($currentUser->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.'
            ], 403);
        }

        // Không cho khóa chính mình
        if ($currentUser->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Bạn không thể khóa chính tài khoản của mình.'
            ], 400);
        }

        // Khóa tài khoản
        $user->status = 'blocked';
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Tài khoản đã bị khóa.',
            'user' => $user
        ], 200);
    }

}
