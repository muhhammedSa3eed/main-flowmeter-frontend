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
import { VerifyOtpSchema } from "@/schemas";
import Image from "next/image";
import { OTPInput, SlotProps } from "input-otp";
import { MinusIcon } from "lucide-react";
export function VerifyOtp({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof VerifyOtpSchema>>({
    resolver: zodResolver(VerifyOtpSchema),
    defaultValues: {
      email: "",
      otp: "",
    },
  });

  const router = useRouter();

  const onSubmitOtp = async (values: z.infer<typeof VerifyOtpSchema>) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      if (!res.ok) {
        toast.error("Failed to verify OTP.");
        return;
      }

      toast.success("Verifed your email successfully .");
      router.push("/login");
    } catch {
      toast.error("Failed Verifed your email .");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-2 border-custom-green">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitOtp)}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Please enter your registered email and OTP.
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
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OTP</FormLabel>
                      <FormControl>
                        <OTPInput
                          id="otp-input"
                          maxLength={6}
                          value={field.value}
                          onChange={field.onChange}
                          containerClassName="flex items-center gap-3"
                          render={({ slots }) => (
                            <>
                              <div className="flex">
                                {slots.slice(0, 3).map((slot, idx) => (
                                  <Slot key={idx} {...slot} />
                                ))}
                              </div>
                              <div className="text-muted-foreground/80">
                                <MinusIcon size={16} aria-hidden="true" />
                              </div>
                              <div className="flex">
                                {slots.slice(3).map((slot, idx) => (
                                  <Slot key={idx} {...slot} />
                                ))}
                              </div>
                            </>
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <LoginButton type="submit" className="w-full">
                  Verify 
                </LoginButton>
              </div>
            </form>
          </Form>

          <div className="relative hidden bg-muted md:flex flex-col items-center justify-center w-full h-full px-20 gap-4">
            <Image
              src="/assets/logo.webp.png"
              alt="Image"
              width={200}
              height={200}
              className="max-w-full max-h-full object-contain "
            />
            <div className="text-center text-sm">
              Already have an account?{" "}
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
function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-9 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  );
}
