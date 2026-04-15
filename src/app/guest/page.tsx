"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GuestPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-7 w-7 text-green-500" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-xl font-semibold">Sign-up Successful 🎉</h1>

        {/* Message */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Your sign-up is completed. You are now a{" "}
          <span className="font-medium text-foreground">guest user</span>.
          <br />
          An admin will review your account and assign you a role.
          <br />
          Once that’s done, you’ll be able to log in again.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button className="rounded-xl" onClick={() => router.push("/sign-in")}>
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
