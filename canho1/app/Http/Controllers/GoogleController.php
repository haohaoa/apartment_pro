<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Google_Client;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function handleGoogleLogin(Request $request)
    {
        $token = $request->input('token');
        $client = new Google_Client(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($token);

        if ($payload) {
            $email = $payload['email'];
            $name = $payload['name'];
            $password = bcrypt(Str::random(16));

            // sửa lại chỗ này
            $user = User::firstOrCreate(
                ['email' => $email],
                ['name' => $name, 'password' => $password]
            );

            $refreshToken = Str::random(60);
            $user->refresh_token = hash('sha256', $refreshToken);
            $user->save();

            $jwt = JWTAuth::fromUser($user);
            return response()->json([
                'success' => true,
                'access_token' => $jwt,
                'user' => $user,
                'refresh_token' => $refreshToken,
                'expires_in' => auth()->factory()->getTTL() * 60,
            ]);
        } else {
            return response()->json(['error' => 'Invalid Token'], 401);
        }
    }
}
