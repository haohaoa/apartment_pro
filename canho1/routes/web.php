<?php

use App\Http\Controllers\NotificationStreamController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// Route::get('/notifications/test', function () {
//     // Gửi 1 thông báo test cho user 1
//     $key = "user:1:notifications";
//     $notifications = Cache::get($key, []);
//     $notifications[] = [
//         'message' => '🎉 Thông báo thử nghiệm thành công!',
//         'time' => now()->toDateTimeString(),
//     ];
//     Cache::put($key, $notifications, 60);
//     return '✅ Đã gửi thông báo test!';
// });
// Route::get('/notifications/stream', [NotificationStreamController::class, 'stream']);
// Route::view('/sse-test', 'sse-test');

Route::get('/contracts/{filename}', function ($filename) {
    $path = storage_path('app/contracts/' . $filename);

    if (!file_exists($path)) {
        abort(404, 'File không tồn tại');
    }

    // Hiển thị file PDF trực tiếp trên trình duyệt
    return response()->file($path);
});