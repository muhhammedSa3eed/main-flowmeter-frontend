'use client';
import React, { useEffect, useId, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Camera } from 'lucide-react';
import { EditProfileSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import LoginButton from '@/components/motion/login';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Role } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Cookies from 'js-cookie';

export default function EditProfile() {
  const id = useId();

  const form = useForm<z.infer<typeof EditProfileSchema>>({
    resolver: zodResolver(EditProfileSchema),
    defaultValues: {
      name: '',
      role: '',
      info: '',
    },
  });

  async function onSubmit(values: z.infer<typeof EditProfileSchema>) {
    console.log(values);
  }

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = Cookies.get('token');
        console.log({ token });
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
    <div className="flex justify-center mt-12">
      <Card className="overflow-hidden border-2 border-custom-green w-[80%] mx-auto md:w-2/3 lg:w-1/2 ">
        <CardContent>
          <div className="flex flex-col items-center text-center pt-3">
            <h3 className="text-2xl font-bold text-custom-green">
              Update Profile
            </h3>
            <p className="text-balance text-muted-foreground">
              Update your RFP account
            </p>
          </div>
          <div className="grid pb-4 md:pb-0 grid-cols-1 md:grid-cols-2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-6 md:px-4 md:pt-4"
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="info"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description" {...field} />
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
                      className="absolute start-1 top-0 z-10 block -translate-y-1/2 bg-background px-2  font-medium text-foreground group-has-[select:disabled]:opacity-50"
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
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
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
                  <LoginButton type="submit" className="w-full">
                    Update
                  </LoginButton>
                </div>
              </form>
            </Form>

            <div className="w-full flex justify-center items-center ">
              <div className="w-full mx-auto">
                <div className="w-full rounded-sm bg-cover bg-center bg-no-repeat items-center">
                  <div className="mx-auto flex justify-center w-[150px] h-[150px] relative">
                    <Avatar className="w-full h-full ">
                      {selectedImage ? (
                        <AvatarImage src={selectedImage} alt="Profile Image" />
                      ) : (
                        <AvatarFallback className="bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                          <Camera className="text-black w-6 h-6" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="absolute bottom-3 right-2 bg-custom-green2 rounded-full w-6 h-6 text-center flex items-center justify-center">
                      <Input
                        type="file"
                        id="upload_profile"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                      <Label
                        htmlFor="upload_profile"
                        className="cursor-pointer"
                      >
                        <Camera className="text-black w-4 h-4" />
                      </Label>
                    </div>
                  </div>
                </div>

                <h2 className="text-center mt-3 font-semibold dark:text-gray-300 ">
                  Upload Profile Image
                </h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
