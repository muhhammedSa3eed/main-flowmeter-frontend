import React, { useId } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { InviteSchema } from "@/schemas";

import { toast } from "react-hot-toast";

export default function InviteUser() {
  const id = useId();

  const form = useForm<z.infer<typeof InviteSchema>>({
    resolver: zodResolver(InviteSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof InviteSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/Account/user/email/${encodeURIComponent(values.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
         
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred.");
        return;
      }
  
      toast.success("User has been invited successfully.");
      form.reset();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to invite user: ${err.message}`);
      } else {
        toast.error("Failed to invite user due to an unknown error.");
      }
    }
  }
  return (
    <>
      <DialogTitle>Invite User</DialogTitle>
      <DialogDescription>Enter email to Invite a new user.</DialogDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 my-3">
          <div className="flex gap-4 ">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <div className="group relative">
                      <FormLabel
                        htmlFor={id}
                        className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                      >
                        <span className="inline-flex bg-background px-2">
                          Email
                        </span>
                      </FormLabel>
                      <Input id={id} type="email" placeholder="" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button size="custom" variant="destructive" className="mr-auto">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              size="custom"
              variant={"Accepted"}
              className="ml-auto"
            >
              Invite
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
