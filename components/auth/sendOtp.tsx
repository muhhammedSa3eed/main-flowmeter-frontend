"use client";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import "../../app/styles/loader.css";
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
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendOtpSchema } from "@/schemas";
import Image from "next/image";

export function SendOtp({
  className,
  ...props
}: React.ComponentProps<"div">) {


  const form = useForm<z.infer<typeof SendOtpSchema>>({
    resolver: zodResolver(SendOtpSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

 const  onSubmitOtp = async (values: z.infer<typeof SendOtpSchema>) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      toast.error("Failed to send OTP.");
      return;
    }

    toast.success("OTP sent to your email.");
    router.push("/verifyOtp");
  } catch {
    toast.error("Failed to send OTP.");
  }
};


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-2 border-custom-green">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitOtp)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground">
                  Please enter your email for the OTP.
                  </p>
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="border-custom-green"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

              

                <LoginButton type="submit" className="w-full">
                  Send Otp
                </LoginButton>
              </div>
            </form>
          </Form>

          <div className="relative hidden bg-muted md:flex flex-col items-center justify-center w-full h-full px-20 gap-4">
            <Image
              src="/assets/logo.webp.png"
              alt="Image"
              width={200}
              height={300}
              className="max-w-full max-h-full object-contain p-4 "
            />
            <div className="text-center text-sm p-4">
              Already have an account?{' '}
              <Link href="/login" className="underline underline-offset-4">
                Log in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
