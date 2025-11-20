<?php
namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RentalOrder;
use App\Repositories\Interfaces\ApartmentRepositoryInterface;
use App\Repositories\Interfaces\BuildingRepositoryInterface;
use App\Repositories\Interfaces\OrderRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Validation\ValidationException;
use App\Mail\MailBookingApartment;
use App\Mail\CancelBookingApartmentMail;
use Illuminate\Support\Facades\Mail;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Repositories\Interfaces\ContractRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Repositories\Interfaces\NotificationRepositoryInterface;


class BookingController extends Controller
{
    protected $contractRepository;
    protected $orderRepository;
    protected $userRepository;
    protected $apartmentRepository;
    protected $buidungRepository;
    protected $notification;

    public function __construct(
        ContractRepositoryInterface $contractRepository,
        OrderRepositoryInterface $OrderRepository,
        UserRepositoryInterface $userRepository,
        BuildingRepositoryInterface $buidungRepository,
        ApartmentRepositoryInterface $apartmentRepository,
        NotificationRepositoryInterface $notificationRepostory,
    ) {
        $this->contractRepository = $contractRepository;
        $this->orderRepository = $OrderRepository;
        $this->userRepository = $userRepository;
        $this->buidungRepository = $buidungRepository;
        $this->apartmentRepository = $apartmentRepository;
        $this->notification = $notificationRepostory;
    }


    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'apartment_id' => 'required|integer|exists:apartments,id',
                'contractNumber' => 'required|string',
                'date' => 'required|integer',
                'month' => 'required|integer',
                'year' => 'required|integer',
                'location' => 'required|string',
                'apartmentAddress' => 'required|string',
                'structure' => 'required|string',
                'monthlyRent' => 'required|numeric',
                'deposit' => 'required|numeric',
                'depositMonths' => 'required|string',
                'duration' => 'required|integer',
                'startDate' => 'required|string',
                'endDate' => 'required|string',
                'paymentDate' => 'required|integer',
                'tenantSignature' => 'required|string',
                'landlordData' => 'required|array',
                'landlordData.name' => 'required|string',
                'landlordData.birthDate' => 'required|string',
                'landlordData.idCard' => 'required|string',
                'landlordData.issueDate' => 'required|string',
                'landlordData.issuePlace' => 'required|string',
                'landlordData.address' => 'required|string',
                'landlordData.phone' => 'required|string',
                'tenantData' => 'required|array',
                'tenantData.name' => 'required|string',
                'tenantData.birthDate' => 'required|string',
                'tenantData.idCard' => 'required|string',
                'tenantData.phone' => 'required|string',
            ]);
            $startdate = Carbon::createFromFormat('d/m/Y', $data['startDate'])->format('Y-m-d');
            $enddate = Carbon::createFromFormat('d/m/Y', $data['endDate'])->format('Y-m-d');
            //kiểm tra đã ký hợp đồng chưa
            $existingOrder = RentalOrder::where('user_id', auth()->user()->id)
                ->where('apartment_id', $data['apartment_id'])
                ->whereIn('status', ['pending', 'approved'])
                ->first();
            if ($existingOrder) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bạn đã ký hợp đồng cho căn hộ này rồi!',
                    'order' => $existingOrder
                ], 400);
            }
            // Bắt đầu transaction
            DB::beginTransaction();
            $apartment = $this->apartmentRepository->find($data['apartment_id']);
            $building = $apartment->building;
            // 1. Tạo order
            $order = $this->orderRepository->create([
                'apartment_id' => $data['apartment_id'],
                'user_id' => auth()->id(),
                'owner_id' => $building->owner_id ?? null,
                'start_date' => $startdate,
                'end_date' => $enddate,
            ]);


            // 2. Lưu contract
            $contract = $order->contract()->create([
                'contract_number' => $data['contractNumber'],
                'apartment_address' => $data['apartmentAddress'],
                'location' => $data['location'],
                'structure' => $data['structure'],
                'monthly_rent' => $data['monthlyRent'],
                'deposit' => $data['deposit'],
                'deposit_months' => $data['depositMonths'],
                'duration' => $data['duration'],
                'start_date' => $startdate,
                'end_date' => $enddate,
                'payment_date' => $data['paymentDate'],
                'landlord_data' => $data['landlordData'],
                'tenant_data' => $data['tenantData'],
                'tenant_signature' => $data['tenantSignature'],
                // 'file_path' => $filePath,
                'contract_date' => now(),
            ]);
            $this->notification->create([
                "user_id" => $building->owner_id,
                "title" => "Thông báo hợp đồng",
                "message" => "Khách thuê đã ký trước hợp đồng tại {$apartment->address}. Vui lòng kiểm tra và xác nhận.",
                "status" => "unread",
                "url" => "/contracts/{$order->id}"

            ]);

            // Gửi thông báo SSE
            pushNotification(
                $building->owner_id,
                "Khách thuê đã ký trước hợp đồng tại {$apartment->address}. Vui lòng kiểm tra và xác nhận.",
                "success",
                "/contracts/{$order->id}"

            );
            // Commit transaction
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Hợp đồng của bạn đã ký thành công! 🎉 Vui lòng chờ chủ nhà xác nhận để hợp đồng chính thức có hiệu lực.',
                'contract_id' => $contract->id,
                // 'file' => $fileName,
            ]);

        } catch (ValidationException $e) {
            DB::rollBack(); // rollback nếu lỗi validation
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack(); // rollback nếu lỗi bất kỳ
            return response()->json([
                'success' => false,
                'message' => 'Server error',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function autoSignContractByOwner($id)
    {
        DB::beginTransaction(); // 🔒 Bắt đầu transaction

        try {
            $order = RentalOrder::findOrFail($id);
            $this->authorize('update', $order);

            $owner = $this->userRepository->find($order->owner_id);
            $orderContract = $this->orderRepository->find($id);
            $contract = $orderContract->contract;

            if (empty($owner->signature)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Chủ nhà chưa có chữ ký tự động.',
                ], 400);
            }

            if ($orderContract->status === 'completed') {
                return response()->json([
                    'success' => false,
                    'message' => 'Hợp đồng này đã được ký trước đó.',
                    'file' => asset('storage/' . $contract->pdf_path),
                    'data' => $contract,
                ], 400);
            }

            // 💰 Tổng tiền
            $total = $contract->monthly_rent * $contract->duration;

            // Dữ liệu render PDF
            $data = [
                'contractData' => [
                    'contractNumber' => $contract->contract_number ?? null,
                    'date' => Carbon::parse($contract->contract_date)->format('d'),
                    'month' => Carbon::parse($contract->contract_date)->format('m'),
                    'year' => Carbon::parse($contract->contract_date)->format('Y'),
                    'location' => $contract->location,
                    'apartmentAddress' => $contract->apartment_address,
                    'structure' => $contract->structure,
                    'monthlyRent' => number_format($contract->monthly_rent),
                    'deposit' => number_format($contract->deposit),
                    'paymentDate' => $contract->payment_date,
                    'duration' => $contract->duration,
                    'startDate' => Carbon::parse($contract->start_date)->format('d/m/Y'),
                    'endDate' => Carbon::parse($contract->end_date)->format('d/m/Y'),
                ],
                'landlordData' => $contract->landlord_data,
                'tenantData' => $contract->tenant_data,
                'landlordSignature' => $owner->signature,
                'tenantSignature' => $contract->tenant_signature,
            ];

            // 🧾 Tạo PDF và lưu file
            $fileName = 'contract_' . time() . '.pdf';
            $filePath = storage_path('app/contracts/' . $fileName);
            Pdf::loadView('contract', $data)->save($filePath);

            // 📝 Cập nhật hợp đồng & trạng thái đơn hàng
            $this->contractRepository->update($contract->id, [
                'landlord_signature' => $owner->signature,
                'landlord_signed_at' => now(),
                'pdf_path' => 'contracts/' . $fileName,
            ]);

            $this->orderRepository->update($id, [
                'status' => 'completed',
            ]);

            // 💳 Tạo payment
            // 1. Chuyển start_date sang Carbon
            $periodStart = Carbon::parse($contract->start_date);

            // 2. Đặt ngày bắt đầu = ngày thanh toán trong tháng
            $day = $contract->payment_date ?? $periodStart->day;
            $periodStart = $periodStart->copy()->day($day); // copy để tránh thay đổi gốc

            // 3. Kỳ đầu tiên kết thúc 1 tháng sau - 1 ngày
            $periodEnd = $periodStart->copy()->addMonthNoOverflow()->subDay();
            // dd( $periodStart, $periodEnd);
            // 4. Tạo payment
            Payment::create([
                'rental_order_id' => $id,
                'amount' => $contract->monthly_rent,
                'total_price' => $total,
                'month' => $periodStart->month,
                'year' => $periodStart->year,
                'period_start' => $periodStart, // YYYY-MM-DD
                'period_end' => $periodEnd,     // YYYY-MM-DD
                'payment_date' => Carbon::now(),
                'method' => 'bank',
                'status' => 'paid',
            ]);

            // Tạo thông báo
            $this->notification->create([
                "user_id" => $orderContract->user_id,
                "title" => "Thông báo hợp đồng",
                "message" => "Hợp đồng tại { $contract->apartment_address} đã được chủ nhà ký. Cảm ơn bạn đã tin tưởng!",
                "status" => "unread",
                "url" => "/dashboard"
            ]);
            // Gửi thông báo SSE
            pushNotification(
                $orderContract->user_id,
                "🎉 Hợp đồng tại { $contract->apartment_address} đã được chủ nhà ký. Cảm ơn bạn đã tin tưởng!",
                "success",
                "/dashboard"
            );
            // ✅ Commit trước khi gửi mail (mail có thể lỗi nhưng không rollback dữ liệu)
            DB::commit();

            // ✉️ Gửi mail (nếu lỗi cũng không ảnh hưởng database)
            try {
                $dataMail = [
                    'contract' => $contract,
                    'tenant' => $contract->tenant_data,
                    'landlord' => $contract->landlord_data,
                    'file_path' => 'contracts/' . $fileName,
                    'tenant_email' => $orderContract->User->email,
                    'landlord_email' => $orderContract->owner->email,
                ];

                Mail::to($dataMail['tenant_email'])->send(new MailBookingApartment($dataMail));
            } catch (\Exception $mailEx) {
                // Không rollback, chỉ báo lỗi mail
                return response()->json([
                    'success' => true,
                    'message' => 'Hợp đồng ký thành công, nhưng gửi mail thất bại.',
                    'file' => asset('storage/contracts/' . $fileName),
                    'error' => $mailEx->getMessage(),
                ], 200);
            }

            return response()->json([
                'success' => true,
                'message' => 'Hợp đồng đã được chủ nhà ký tự động.',
                'file' => asset('storage/contracts/' . $fileName),
            ]);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Bạn không có quyền thực hiện hành động này.',
            ], 403);
        } catch (\Exception $e) {
            DB::rollBack(); // ⛔ Nếu có lỗi, rollback tất cả
            return response()->json([
                'success' => false,
                'message' => 'Tự động ký hợp đồng thất bại.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function EnforceContract($id)
    {
        try {
            $order = RentalOrder::findOrFail($id);
            // xác minh chủ
            $this->authorize('update', $order);

            $orderContract = $this->orderRepository->find($id);

            $contract = $orderContract->contract;
            // Cập nhật trạng thái hợp đồng
            $this->orderRepository->update($id, [
                'status' => 'rejected',
            ]);

            $dataMail = [
                'contract' => $contract,
                'tenant' => $contract->tenant_data,
                'landlord' => $contract->landlord_data,
                'tenant_email' => $orderContract->User->email,
                'landlord_email' => $orderContract->owner->email,
            ];

            try {
                // Gửi mail thông báo cho khách thuê và chủ nhà
                Mail::to($dataMail['tenant_email'])->send(new CancelBookingApartmentMail($dataMail));

            } catch (\Exception $mailException) {
                return response()->json([
                    'success' => false,
                    'message' => 'hủy hợp đồng thành công nhưng gửi mail thất bại.',
                    'error' => $mailException->getMessage(),
                    'data' => $contract,
                ], 500);
            }
            // Tạo thông báo
            $this->notification->create([
                "user_id" => $orderContract->user_id,
                "title" => "Thông báo hủy hợp đồng",
                "message" => "Hợp đồng tại {$contract->apartment_address} đã bị hủy bởi chủ nhà. Mọi vấn đề liên quan sẽ được xử lý theo điều khoản trong hợp đồng.",
                "status" => "unread",
            ]);

            // Gửi thông báo SSE
            pushNotification(
                $orderContract->user_id,
                "Hợp đồng tại {$contract->apartment_address} đã bị hủy bởi chủ nhà. Mọi vấn đề liên quan sẽ được xử lý theo điều khoản trong hợp đồng.",
                "error"
            );


            return response()->json([
                'success' => true,
                'message' => 'Hợp đồng đã được chủ nhà hủy',
                'data' => $contract,
            ]);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này.',
                'success' => false,
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Hủy hợp đồng thất bại.',
                'error' => $e->getMessage(),
                'success' => false,
            ], 500);
        }
    }
}
