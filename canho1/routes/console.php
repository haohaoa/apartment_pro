<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Cấu hình chạy mỗi 1 phút
Schedule::command('schedules:update-status')->everyMinute();
//10p everyFiveMinutes
// Schedule::command('apartments:suggest')->everyMinute();
Schedule::command('schedules:update-payment')->everyMinute();
