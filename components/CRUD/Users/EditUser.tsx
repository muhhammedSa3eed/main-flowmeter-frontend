import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useEffect, useId, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
// import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EditUserSchema } from '@/schemas';
import { toast } from 'react-hot-toast';
import { Role, User } from '@/types';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import {
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

interface EditUserProps {
  users: User;
}

const status = [
  {
    Id: 1,
    Value: 'active',
    label: <Badge className="bg-green-500">Active</Badge>,
  },
  {
    Id: 2,
    Value: 'inactive',
    label: <Badge className="bg-gray-400">Inactive</Badge>,
  },
  {
    Id: 3,
    Value: 'suspended',
    label: <Badge className="bg-yellow-500">Suspended</Badge>,
  },
  {
    Id: 4,
    Value: 'pending',
    label: <Badge className="bg-blue-500">Pending</Badge>,
  },
  {
    Id: 5,
    Value: 'banned',
    label: <Badge className="bg-red-600">Banned</Badge>,
  },
];

export default function EditUser({ users }: EditUserProps) {
  const id = useId();

  const router = useRouter();
  const token = Cookies.get('token');
  console.log({ token });
  const form = useForm<z.infer<typeof EditUserSchema>>({
    resolver: zodResolver(EditUserSchema),
    defaultValues: {
      status: users.status,
      role: users.role.name,
    },
  });

  async function onSubmit(values: z.infer<typeof EditUserSchema>) {
    const payload = {
      ...values,
      id: users.id,
      // property: values.property,
    };
    console.log({ payload });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/${users.id}`,

        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token ? `Bearer ${token}` : '',
          },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log({ errorData });
        toast.error(errorData.message || 'An error occurred.');
      } else {
        toast.success('User has been successfully Updated.');
        form.reset();
        router.refresh();

        // window.location.reload();
      }

      // fetchDevices();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Failed to update User: ${err.message}`);
      } else {
        toast.error('Failed to update User due to an unknown error.');
      }
    }
  }
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get('token');

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/roles`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : '',
            },
            credentials: 'include',
          }
        );
        if (!res.ok) throw new Error('Failed to fetch roles');

        const data: Role[] = await res.json(); // ⬅️ Typed!
        setRoles(data);
      } catch (error) {
        console.error('Failed to fetch roles', error);
      }
    };

    fetchRoles();
  }, []);
  return (
    <>
      <SheetTitle className="mb-2">Update User</SheetTitle>
      <SheetDescription className="mb-2">
        Change the details to Update a user.
      </SheetDescription>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Username and Name on the same line */}

          <div className="group relative flex-1">
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
                <FormItem className="flex-1">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group" />
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
          <div className="group relative flex-1">
            {/* Overlapping Label */}
            <FormLabel
              htmlFor={id}
              className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2 text-xs font-medium text-foreground group-has-[select:disabled]:opacity-50"
            >
              Status
            </FormLabel>

            {/* Select Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {status.map((item) => (
                          <SelectItem key={item.Id} value={item.Value}>
                            {item.label}
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

          <SheetFooter>
            <SheetClose asChild>
              <Button size="custom" variant="destructive" className="mr-auto">
                Cancel
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button
                type="submit"
                size="custom"
                variant={'Accepted'}
                className="ml-auto"
              >
                Save
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}
