"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/admin-auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();

      if (!res.success) {
        console.log(res.message);
        return;
      }

      router.push("/dashboard");
    } catch (error) {
      console.log("error while signing in: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">
      {/* Glow Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      <Card className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-3xl">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white text-lg font-bold shadow-lg">
            ✦
          </div>
          <CardTitle className="text-2xl font-semibold text-white">
            Welcome back
          </CardTitle>
          <CardDescription className="text-zinc-400 text-sm">
            Enter your details to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300 text-sm">
                Email address
              </Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300 text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 bg-white/5 border-white/10 text-white pr-10 placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-zinc-400">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Forgot?
              </button>
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90 text-white font-medium flex items-center justify-center gap-2 shadow-lg"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin" size={16} />}
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          {/* <div className="flex items-center gap-2 my-6">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-zinc-500">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-white/10" />
          </div> */}

          {/* Social */}
          {/* <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Google
            </Button>
            <Button
              variant="outline"
              className="h-11 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              GitHub
            </Button>
          </div> */}

          {/* Footer */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            New here?{" "}
            <span className="text-purple-400 hover:underline cursor-pointer">
              Create an account
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
