/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { LogOut, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/logout';
// const clearSessionCookie = () => {
//   document.cookie =
//     'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=; secure;';
// };

export default function AvatarWithLogout() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleLogout = async (): Promise<void> => {
    startTransition(async () => {
      const response = await logout();

      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        router.push('/');
      }
    });
   
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src="/assets/logo.webp.png" />
          <AvatarFallback>RFP</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={'/dashboard/editProfile'}>
          <DropdownMenuItem className="flex justify-between items-center text-blue-500">
            <span>Edit Profile</span>
            <Pencil />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          className="flex justify-between items-center text-red-500"
          onClick={handleLogout}
        >
          Logout
          <LogOut className="ml-auto size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
