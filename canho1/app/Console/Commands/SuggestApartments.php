<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ViewingSchedule;
use App\Models\ChatHistory;

class SuggestApartments extends Command
{
    protected $signature = 'apartments:suggest';
    protected $description = 'Tự động gửi lời nhắn nhẹ nhàng sau khi người dùng xem phòng';

    public function handle()
    {
        // Lấy danh sách lịch đã "viewed" mà chưa từng gửi tin nhắn follow-up
        $schedules = ViewingSchedule::where('status', 'viewed')
            ->with(['apartment', 'user'])
            ->get();

        foreach ($schedules as $schedule) {
            $user = $schedule->user;
            $apartment = $schedule->apartment;

            if (!$user || !$apartment) {
                continue;
            }

            // ✅ Tạo tin nhắn tự nhiên, thân thiện
            $message = sprintf(
                "Chào %s 🌟\nBạn vừa xem căn hộ *%s*, cảm nhận thế nào? Nếu chưa thật sự ưng ý, mình có thể giúp bạn tìm căn khác theo nhu cầu nhé! 🏡",
                $user->name ?? 'bạn',
                $apartment->address ?? 'căn hộ vừa rồi'
            );

            ChatHistory::create([
                'user_id' => $user->id,
                'role' => 'assistant',
                'content' => $message,
            ]);

        }

        $this->info('✅ Đã gửi lời nhắn cảm ơn sau khi xem phòng.');
    }
}
