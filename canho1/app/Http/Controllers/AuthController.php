<?php

namespace App\Http\Controllers;

use App\Mail\OtpMail;
use App\Repositories\Eloquent\UserRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    protected $user;
    public function __construct(UserRepository $user)
    {
        $this->user = $user;
    }
    public function logout()
    {
        $user = auth()->user();
        if ($user) {
            $user->refresh_token = null; // xóa refresh token khi logout
            $user->save();
        }

        auth()->logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function login(Request $request)
    {
        // 1. Validate dữ liệu đầu vào
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        // 2. Xác thực người dùng
        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email hoặc mật khẩu không đúng'
            ], 401);
        }

        // 3. Lấy thông tin người dùng hiện tại
        $user = auth()->user();

        // 4. Sinh refresh token và lưu hash vào DB
        $refreshToken = Str::random(60);
        $user->refresh_token = hash('sha256', $refreshToken);
        $user->save();

        // 5. Trả về response chuẩn
        return response()->json([
            'access_token' => $token,
            'refresh_token' => $refreshToken, // gửi bản gốc cho client
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => $user,
            'success' => true,
        ]);
    }

    public function register(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
        ]);

        $token = auth()->login($user);
        $refreshToken = Str::random(60);
        $user->refresh_token = hash('sha256', $refreshToken);
        $user->save();

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'expires_in' => auth()->factory()->getTTL() * 60,
            'refresh_token' => $refreshToken,
            'success' => true,
        ], 201);
    }



    public function registerOwner(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'signature' => 'nullable|string',
            'idCard' => 'nullable|string|max:50',
            'birthDate' => 'nullable|date',
            'bank_name'=> 'required|string',
            'bank_account' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validatedData = $validator->validated();

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']),
            'signature' => $validatedData['signature'] ?? null,
            'idCard' => $validatedData['idCard'] ?? null,
            'birthDate' => $validatedData['birthDate'] ?? null,
            'role' => 'owner',
            'bank_name' => $validatedData['bank_name'], 
            'bank_account_number' => $validatedData['bank_account'],
        ]);

        // tạo refresh token
        $refreshToken = Str::random(60);
        $user->refresh_token = hash('sha256', $refreshToken);

        // tạo mã OTP (6 số)
        $otp = rand(100000, 999999);
        $user->verification_code = $otp;
        $user->save();

        // gửi mail OTP
        Mail::to($user->email)->send(new OtpMail($otp, $request->name));

        $token = auth()->login($user);

        return response()->json([
            'user' => $user->makeHidden(['password', 'remember_token', 'refresh_token', 'verification_code']),
            'access_token' => $token,
            'expires_in' => auth()->factory()->getTTL() * 60,
            'refresh_token' => $refreshToken,
            'message' => 'Đăng ký thành công, vui lòng kiểm tra email để xác thực.',
            'success' => true,
        ], 201);
    }




    public function refreshToken(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        $user = User::where('refresh_token', hash('sha256', $refreshToken))->first();

        if (!$user) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }

        $newAccessToken = auth()->login($user);

        return response()->json([
            'access_token' => $newAccessToken,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'success' => true
        ]);
    }
    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);

        $user = User::where('email', $validated['email'])
            ->where('verification_code', $validated['otp'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Mã OTP không chính xác.'], 400);
        }

        $user->email_verified_at = now();
        $user->verification_code = null; // xoá OTP sau khi dùng
        $user->save();

        return response()->json([
            'message' => 'Xác thực email thành công!',
            'success' => true,
        ]);
    }

    public function resendOtp(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email không tồn tại'], 404);
        }

        // Sinh mã OTP mới
        $otpCode = rand(100000, 999999);
        $this->user->resendOtp($request->email, $otpCode);


        // Gửi mail
        Mail::to($user->email)->send(new OtpMail($otpCode, $user->name));

        return response()->json([
            'message' => 'OTP mới đã được gửi',
            'expired_in' => '5 phút'
        ]);
    }

    //trả thông tin cho người dùng
    public function me(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json([
                'success' => true,
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xác thực người dùng',
                'error' => $e->getMessage()
            ], 401);
        }
    }
}
