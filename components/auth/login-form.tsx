/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm as useZodForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoginButton from "@/components/motion/login";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useId, useMemo, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, SendOtpSchema } from "@/schemas";
import Image from "next/image";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [pendingAccount, setPendingAccount] = useState(false);
  const router = useRouter();

  const toggleVisibility = () => setIsVisible((prev) => !prev);

  const form = useZodForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const sendOtpForm = useZodForm<z.infer<typeof SendOtpSchema>>({
    resolver: zodResolver(SendOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (
          data?.message ===
          "Your account is not verified. Please check your email for the OTP."
        ) {
          setPendingAccount(true);
          sendOtpForm.setValue("email", values.email);
          toast.error("Your account is not verified.");
          return;
        }

        if (data?.message === "Account is suspended. Contact support.") {
          toast.error("Your account is suspended.");
          return;
        }

        toast.error("Invalid username or password.");
        return;
      }

      const userGroup = data?.user?.group?.name;
      const permissions = data?.user?.permissions;

      if (!userGroup || !permissions) {
        toast.error("Login response missing permission or group info.");
        return;
      }

      // ✅ Save user data and permissions
      Cookies.set("user", JSON.stringify(data), { sameSite: "Strict" });
      localStorage.setItem("permissions", JSON.stringify(permissions));

      // ✅ Redirect based on group
      if (userGroup === "admin" || userGroup === "SuperAdmin") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }

      toast.success("You have successfully logged in.");
    } catch (error) {
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-2 border-custom-green">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground">
                    Login to your RFP account
                  </p>
                </div>

                {/* OTP Alert */}
                {pendingAccount && (
                  <div className="rounded-md border border-amber-300  px-4 py-3 mt-2">
                    <div className="flex gap-3">
                      <TriangleAlert
                        className="shrink-0 mt-0.5 text-amber-500"
                        size={16}
                      />
                      <div className="flex-grow">
                        <p className="text-sm mb-2">
                          Your account is not verified. Please enter your email
                          to receive the OTP.
                        </p>
                        <Link
                          href="/sendOtp"
                          className="underline underline-offset-4"
                        >
                          Send Otp
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Input */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="border-custom-green"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Input */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={isVisible ? "text" : "password"}
                            placeholder="Password"
                            className="pe-9"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              field.onChange(e);
                            }}
                          />
                          <button
                            type="button"
                            onClick={toggleVisibility}
                            className="absolute inset-y-0 end-0 w-9 flex items-center justify-center text-muted-foreground"
                          >
                            {isVisible ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoginButton type="submit" className="w-full">
                  Login
                </LoginButton>
              </div>
            </form>
          </Form>

          <div className="hidden md:flex flex-col items-center justify-center bg-muted px-20 gap-4">
            <Image
              src="/assets/logo.webp.png"
              alt="Logo"
              width={200}
              height={200}
              className="object-contain"
            />
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
