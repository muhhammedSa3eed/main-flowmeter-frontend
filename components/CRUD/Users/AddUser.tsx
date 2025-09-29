import React, { useEffect, useId, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
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
import { UserSchema } from "@/schemas";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

import { CheckIcon, Eye, EyeOff, XIcon } from "lucide-react";

import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import Cookies from "js-cookie";
import { Role } from "@/types";

export default function AddUser() {
  const id = useId();

  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: "At least 1 special character (e.g., @, !, #)",
      },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);
  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };
  const token = Cookies.get("token");
  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({
            ...values,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || "An error occurred.");
        return;
      }
      console.log("users data :", values);
      toast.success("Users has been successfully added.");
      form.reset();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to add users: ${err.message}`);
      } else {
        toast.error("Failed to add users due to an unknown error.");
      }
    }
  }
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/roles`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch roles");

        const data: Role[] = await res.json();
        setRoles(data);
      } catch (error) {
        console.error("Failed to fetch roles", error);
      }
    };

    fetchRoles();
  }, []);
  return (
    <>
      <SheetTitle className="mb-2">Add User</SheetTitle>
      <SheetDescription className="mb-2">
        Fill in the details to Add a new user.
      </SheetDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.warn("❌ Validation failed:", errors);
          })}
        >
          {/* Username and Name on the same line */}
          {/* Email Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormControl>
                  <div className="group relative">
                    <FormLabel
                      htmlFor={id}
                      className="origin-start absolute top-1/2 block -translate-y-1/2 cursor-text px-1 text-sm text-muted-foreground/70 transition-all group-focus-within:pointer-events-none group-focus-within:top-0 group-focus-within:cursor-default group-focus-within:text-xs group-focus-within:font-medium group-focus-within:text-foreground has-[+input:not(:placeholder-shown)]:pointer-events-none has-[+input:not(:placeholder-shown)]:top-0 has-[+input:not(:placeholder-shown)]:cursor-default has-[+input:not(:placeholder-shown)]:text-xs has-[+input:not(:placeholder-shown)]:font-medium has-[+input:not(:placeholder-shown)]:text-foreground"
                    >
                      <span className="inline-flex bg-background px-2">
                        Username
                      </span>
                    </FormLabel>
                    <Input id={id} type="text" placeholder="" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-3">
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

          <div className="group relative">
            {/* Overlapping Label */}
            <FormLabel
              htmlFor={id}
              className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
            >
              Role
            </FormLabel>

            {/* Select Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem className="flex-1 mb-3">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mb-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div>
                    <div className="relative">
                      <Input
                        {...field}
                        id={id}
                        className="pe-9"
                        placeholder="Password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          field.onChange(e);
                        }}
                        aria-invalid={strengthScore < 4}
                        aria-describedby={`${id}-description`}
                      />
                      <button
                        className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10  focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                        type="button"
                        onClick={toggleVisibility}
                        aria-label={
                          isVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isVisible}
                      >
                        {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div
                      className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                      role="progressbar"
                      aria-valuenow={strengthScore}
                      aria-valuemin={0}
                      aria-valuemax={4}
                      aria-label="Password strength"
                    >
                      <div
                        className={`h-full ${getStrengthColor(
                          strengthScore
                        )} transition-all duration-500 ease-out`}
                        style={{
                          width: `${(strengthScore / 4) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <p
                      id={`${id}-description`}
                      className="mb-2 text-sm font-medium text-foreground"
                    >
                      {getStrengthText(strengthScore)}
                    </p>

                    <ul
                      className="space-y-1.5"
                      aria-label="Password requirements"
                    >
                      {strength.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                          {req.met ? (
                            <CheckIcon
                              size={16}
                              className="text-emerald-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <XIcon
                              size={16}
                              className="text-muted-foreground/80"
                              aria-hidden="true"
                            />
                          )}
                          <span
                            className={`text-xs ${
                              req.met
                                ? "text-emerald-600"
                                : "text-muted-foreground"
                            }`}
                          >
                            {req.text}
                            <span className="sr-only">
                              {req.met
                                ? " - Requirement met"
                                : " - Requirement not met"}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
              Add
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
}
