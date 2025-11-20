"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { AuthAPI } from "@/services/api";
import {useAuth} from "@/context/auth-context";
import { ca } from "date-fns/locale";
import Swal from 'sweetalert2';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();
  const {user, authGoogle} = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push("/");
    } else {
    
      Swal.fire({
        title: 'Email hoặc mật khẩu không đúng!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleGoogleSuccess = async (res: any) => {
    const token = res?.credential;
    const response = await authGoogle(token);
    console.log("Google token:", token);
    if (response) {
      router.push("/");
    } else {
       Swal.fire({
        title: 'đăng nhập google thất bại',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  const handleGoogleError = () => {
    console.error("Đăng nhập Google thất bại");
  };
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
          <CardDescription>
            Nhập email và mật khẩu của bạn để đăng nhập vào tài khoản.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Đăng nhập
            </Button>
          </form>
        </CardContent>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <div className="flex items-center justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </GoogleOAuthProvider>
        <CardFooter className="text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="underline" prefetch={false}>
            Đăng ký
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
