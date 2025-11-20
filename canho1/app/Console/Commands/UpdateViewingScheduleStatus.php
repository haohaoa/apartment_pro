<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ViewingSchedule;
use Carbon\Carbon;
use Laravel\Scheduling\Attributes\AsScheduled;

#[AsScheduled('everyMinute')]
class UpdateViewingScheduleStatus extends Command
{
    protected $signature = 'schedules:update-status';
    protected $description = 'Tự động cập nhật trạng thái lịch xem phòng theo thời gian';

    public function handle()
    {
        $now = Carbon::now();

        $updatedViewed = ViewingSchedule::where('status', 'pending')
            ->where('scheduled_at', '<=', $now)
            ->update(['status' => 'viewed']);

        $updatedCancelled = ViewingSchedule::where('status', 'viewed')
            ->where('deadline', '<=', $now)
            ->update(['status' => 'cancelled']);


        $this->info("Cập nhật {$updatedViewed} lịch thành 'viewed', {$updatedCancelled} lịch thành 'cancelled {$now}'");
    }
}