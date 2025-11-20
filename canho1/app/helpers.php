<?php

use Illuminate\Support\Facades\Cache;

if (!function_exists('pushNotification')) {
    function pushNotification(int $userId, string $message, string $type = 'info', string $url)
    {
        $key = "user:{$userId}:notifications";
        $notifications = Cache::get($key, []);

        $notifications[] = [
            'message' => $message,
            'type' => $type, // thêm kiểu thông báo
            'time' => now()->toDateTimeString(),
            'url' => $url
        ];

        Cache::put($key, $notifications, 60); // giữ trong cache 1 phút
    }
}