<?php

namespace App\Console\Commands;

use App\Repositories\Interfaces\NotificationRepositoryInterface;
use Illuminate\Console\Command;
use App\Models\Payment;
use App\Models\RentalOrder;
use App\Models\Notifications;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Laravel\Scheduling\Attributes\AsScheduled;

#[AsScheduled('everyMinute')]
class UpdateBookingPayment extends Command
{
    protected $signature = 'schedules:update-payment';
    protected $description = 'Tự động kiểm tra và cập nhật trạng thái thanh toán các đơn thuê.';
    protected $notification;
    public function __construct(
        NotificationRepositoryInterface $notification
    ) {
        $this->notification = $notification;
        parent::__construct();
    }

    public function handle()
    {
        $now = Carbon::now();

        // Lấy danh sách đơn thuê đang hoạt động
        $activeOrders = RentalOrder::where('status', 'completed')->get();

        $createdCount = 0;
        $updatedCount = 0;

        foreach ($activeOrders as $order) {
            $contract = $order->contract;

            if (!$contract) {
                continue; // nếu chưa có hợp đồng thì bỏ qua
            }

            // Lấy kỳ thanh toán mới nhất của đơn
            $lastPayment = Payment::where('rental_order_id', $order->id)
                ->orderByDesc('period_end')
                ->first();

            if ($lastPayment) {
                // ✅ Nếu kỳ cuối đã kết thúc hoặc đến hạn, tạo kỳ tiếp theo
                if (Carbon::parse($lastPayment->period_end)->lt($now)) {
                    $periodStart = Carbon::parse($lastPayment->period_end)->addDay();
                    $periodEnd = (clone $periodStart)->addMonthNoOverflow()->subDay();

                    $data = Payment::create([
                        'rental_order_id' => $order->id,
                        'amount' => 0,
                        'total_price' => $contract->monthly_rent,
                        'month' => $periodStart->month,
                        'year' => $periodStart->year,
                        'period_start' => $periodStart,
                        'period_end' => $periodEnd,
                        'payment_date' => null,
                        'method' => null,
                        'status' => 'unpaid',
                    ]);
                    // 🔔 Gửi thông báo cho khách hàng
                    if ($order->user_id) {
                        pushNotification(
                            $order->user_id,
                            "📅 Đến kỳ thanh toán tiền thuê tháng {$periodStart->month}/{$periodStart->year} cho căn hộ của bạn. Vui lòng thanh toán sớm để tránh phát sinh phí trễ hạn nhé!",
                            "info",
                            "/dashboard/payment/{$data->id}",
                        );

                        try {
                            $this->notification->create([
                                "user_id" => $order->user_id,
                                "title" => "Thông báo thanh toán tiền thuê",
                                "message" => "Đã đến kỳ thanh toán tiền thuê tháng {$periodStart->month}/{$periodStart->year} cho căn hộ của bạn. Vui lòng hoàn tất thanh toán sớm để đảm bảo quyền lợi.",
                                "type" => "payment",
                                "status" => "unread",
                                "url" => "/dashboard/payment/{$data->id}"
                            ]);
                        } catch (\Exception $e) {
                            // \Log::error("Lỗi tạo thông báo: " . $e->getMessage());
                        }
                    }
                    $createdCount++;
                }

                // ✅ Cập nhật các kỳ quá hạn
                if ($lastPayment->status === 'unpaid' && Carbon::parse($lastPayment->period_end)->lt($now)) {
                    $lastPayment->update(['status' => 'failed']);
                    pushNotification(
                        $order->user_id,
                        "Đã quá kỳ thanh toán tiền thuê tháng {$periodStart->month}/{$periodStart->year} cho căn hộ của bạn. Vui lòng thanh toán sớm nhé!",
                        "info",
                        "/dashboard/payment/{$lastPayment->id}"

                    );
                    $updatedCount++;
                }

            } else {
                // ✅ Chưa có kỳ nào, tạo kỳ đầu tiên nếu start_date <= now
                $periodStart = Carbon::parse($contract->start_date);
                if ($periodStart->lte($now)) {
                    $periodEnd = (clone $periodStart)->addMonthNoOverflow()->subDay();

                    Payment::create([
                        'rental_order_id' => $order->id,
                        'amount' => 0,
                        'total_price' => $contract->monthly_rent,
                        'month' => $periodStart->month,
                        'year' => $periodStart->year,
                        'period_start' => $periodStart,
                        'period_end' => $periodEnd,
                        'payment_date' => null,
                        'method' => null,
                        'status' => 'unpaid',
                    ]);

                    $createdCount++;
                }
            }
        }

        $this->info("Tạo mới {$createdCount} kỳ thanh toán và cập nhật {$updatedCount} kỳ quá hạn.");
    }
}
