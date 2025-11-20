<?php

use App\Http\Controllers\ApartmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\buildingController;
use App\Http\Controllers\Chatbox_Controller;
use App\Http\Controllers\ChatBoxProController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\NotificationStreamController;
use App\Http\Controllers\routeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookingController;


// thông báo
Route::get('/notifications/stream', [NotificationStreamController::class, 'stream']);

//clinet
//login google
Route::post('/google/callback', [GoogleController::class, 'handleGoogleLogin']);
//search
Route::get('/search', [routeController::class, 'searchApartment']);
//login
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/register', [AuthController::class, 'register']);
Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
//thông tin căn hộ
Route::get('/getApartment/{id}', [routeController::class, 'getApartment']);
Route::middleware('auth:api')->group(function () {
    //thông báo cho cả 2
    Route::get('/notifications', [NotificationStreamController::class, 'getNotificationsByUserId']);
    Route::post('/notifications/mark-all-read', [NotificationStreamController::class, 'markAllAsRead']);
    //căn hộ đã thuể của user
    Route::get('/rented-apartment', [ApartmentController::class, 'getUserRentedApartmentIds']);
    //chatt
    Route::post('/chat-pro', [Chatbox_Controller::class, 'chatBot']);
    Route::post('/chat-pro', [ChatBoxProController::class, 'chatBot']);
    Route::get('/getchatbox', [routeController::class, 'getChatApi']);
    //get user info
    Route::post('/getphone', [routeController::class, 'getPhone']);
    //logout
    Route::get('/logout', [AuthController::class, 'logout']);
    //booking
    Route::post('/booking', [routeController::class, 'booking']);
    Route::get('/viewing-schedules', [routeController::class, 'getViewingSchedules']);
    Route::get('/cancel/{id}', [routeController::class, 'cancel']);
    Route::get('/viewing-schedules/{id}', [routeController::class, 'getBookingById']);
    Route::post('/bookings-store', [BookingController::class, 'store']);
    //thanh toán
    Route::get('/mark-as-paid/{id}', [routeController::class, 'markAsPaid']);
});
///owner
Route::post('/register-owner', [AuthController::class, 'registerOwner']);
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
//gửi lại otp
Route::post('/resend-otp', [AuthController::class, 'resendOtp']);

Route::middleware('auth:api')->group(function () {
    //thông tin mới nhất 
    Route::post('/me', [AuthController::class, 'me']);
    Route::get('/contract-byowner/{id}', [BookingController::class, 'autoSignContractByOwner']);
    // lấy chữ ký
    Route::post('/signature', [routeController::class, 'getSignature']);
    // cập nhật chữ ký
    Route::post('/update-signature', [routeController::class, 'updateSignature']);
    // building 
    Route::get('/all-building', [buildingController::class, 'getAllBuilding']);
    Route::get('/all-building-admin', [buildingController::class, 'getAllBuildingAdmin']);
    Route::put('/update-building/{id}', [buildingController::class, 'updateBuilding']);
    Route::post('/create-building', [buildingController::class, 'createBuilding']);
    Route::delete('/delete-building/{id}', [buildingController::class, 'deleteBuilding']);
    Route::get('/get-building/{id}', [buildingController::class, 'getBuildingById']);
    // apartment
    Route::post('/create-apartment/{building_id}', [ApartmentController::class, 'store']);
    Route::delete('/delete-apartment/{id}', [ApartmentController::class, 'delete']);
    Route::get('/view-apartment/{id}', [ApartmentController::class, 'viewApartment']);
    Route::post('/update-apartment/{id}', [ApartmentController::class, 'update']);
    // hợp đồng 
    Route::get('/contract', [ContractController::class, 'viewAllById']);
    Route::get('/contract-admin', [ContractController::class, 'viewAllByIdAdmin']);
    Route::get('/contract/{id}', [ContractController::class, 'getByIdContract']);
    Route::get('/enforceContract/{id}', [BookingController::class, 'EnforceContract']);
    // thông tin thanh toán
    Route::post('/owner_payment', [routeController::class, 'getOwnerPayment']);
    // lấy lịch xem phòng 
    Route::get('/viewing-schedules-owner', [routeController::class, 'getScheduleOwner']);
    Route::get('/viewing-schedules-admin', [routeController::class, 'getScheduleAdmin']);

    Route::get('/viewing-schedules-owner/{id}', [routeController::class, 'getScheduleOwnerDetail']);
    Route::delete('/cancel-schedule/{id}', [routeController::class, 'cancelSchedule']);
    //thanh toán
    Route::get('/confirm-payment/{id}', [routeController::class, 'confirmPayment']);
    //dashboard
    Route::get('/dashboard', [routeController::class, 'getDashboard']);
});
Route::post('/test-search', [Chatbox_Controller::class, 'testSearch']);
Route::middleware('auth:api')->group(function () {
    //user
    Route::get('/user', [routeController::class, 'getallUser']);
    Route::delete('/delete-user/{id}', [routeController::class, 'deleteUser']);
    Route::post('/update-user/{id}', [routeController::class, 'updateUser']);
    Route::get('/user/{id}', [routeController::class, 'getByIdUser']);
    Route::put('block-user/{id}', [routeController::class, 'blockUser']);
});