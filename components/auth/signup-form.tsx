'use client';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '@/schemas';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import LoginButton from '@/components/motion/login';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { CheckIcon, Eye, EyeOff, XIcon } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function Signupform({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const id = useId();
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: 'At least 8 characters' },
      { regex: /[0-9]/, text: 'At least 1 number' },
      { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
      { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
      {
        regex: /[!@#$%^&*(),.?":{}|<>]/,
        text: 'At least 1 special character (e.g., @, !, #)',
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
    if (score === 0) return 'bg-border';
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score === 3) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return 'Enter a password';
    if (score <= 2) return 'Weak password';
    if (score === 3) return 'Medium password';
    return 'Strong password';
  };

  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset();
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    console.log(JSON.stringify(values));
    const bodyData = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    try {
      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          credentials: 'include',
          body: JSON.stringify(bodyData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.message || 'An error occurred.');
        return;
      }
      const data = await response.json();
      console.log({ data });
      router.push('/verifyOtp');
      toast.success('Sign Up in Neuss-HMI successfully.');
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to Sign Up in Neuss-HMI: ${err.message}`);
      } else {
        toast.error('Failed to Sign Up in Neuss-HMI due to an unknown error.');
      }
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden border-2 border-custom-green">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold text-custom-green">
                    Welcome back
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    Sign up in RFP
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              // id={id}
                              type="text"
                              placeholder="Enter your username"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              // id={id}
                              type="email"
                              placeholder="Enter your Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div>
                              <div className="relative">
                                <Input
                                  {...field}
                                  // id={id}
                                  className="pe-9"
                                  placeholder="Password"
                                  type={isVisible ? 'text' : 'password'}
                                  value={password}
                                  onChange={(e) => {
                                    setPassword(e.target.value);
                                    field.onChange(e);
                                  }}
                                  aria-invalid={strengthScore < 4}
                                  aria-describedby={`${id}-description`}
                                />
                                <button
                                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline  focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                                  type="button"
                                  onClick={toggleVisibility}
                                  aria-label={
                                    isVisible
                                      ? 'Hide password'
                                      : 'Show password'
                                  }
                                  aria-pressed={isVisible}
                                >
                                  {isVisible ? (
                                    <EyeOff size={16} />
                                  ) : (
                                    <Eye size={16} />
                                  )}
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
                                  <li
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
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
                                          ? 'text-emerald-600'
                                          : 'text-muted-foreground'
                                      }`}
                                    >
                                      {req.text}
                                      <span className="sr-only">
                                        {req.met
                                          ? ' - Requirement met'
                                          : ' - Requirement not met'}
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
                  </div>
                </div>

                <LoginButton type="submit" className="w-full">
                  Sign up
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
