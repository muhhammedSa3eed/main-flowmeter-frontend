'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';

import { NavMain } from '@/components/SideBar/nav-main';
import { NavUser } from '@/components/SideBar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Table, Cable, Users, ShieldCheck, SquareMenu } from 'lucide-react';
import RotatingCube from '../motion/UseAnimationFrame';
import Link from 'next/link';

const navMainItems = [
  {
    title: 'Flow-meter-Table',
    url: '/dashboard/Rfp-Compliance',
    icon: Table,
    permissionKey: 'Rfp',
  },
  {
    title: 'Connections',
    url: '/dashboard/connections',
    icon: Cable,
    permissionKey: 'Devices',
  },
  {
    title: 'Users',
    url: '/dashboard/user',
    icon: Users,
    permissionKey: 'Users',
  },
  {
    title: 'Permissions',
    url: '/dashboard/permissions',
    icon: ShieldCheck,
    permissionKey: 'permissions',
  },
  {
    title: 'Reports',
    url: '/dashboard/RfpReports',
    icon: SquareMenu,
    permissionKey: 'reports',
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const [filteredItems, setFilteredItems] = useState<typeof navMainItems>([]);

  // useEffect(() => {
  //   const raw = localStorage.getItem('permissions');
  //   console.log({ raw });
  //   const permissions = raw ? JSON.parse(raw) : {};

  //   const allowedItems = navMainItems.filter(
  //     (item) => permissions?.[item.permissionKey]?.canRead
  //   );

  //   setFilteredItems(allowedItems);
  // }, []);

  const user = {
    name: 'Neuss',
    des: 'Created By Neuss',
    avatar: '/assets/logo.webp.png',
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <RotatingCube />
                <span className="text-base font-semibold ml-3">Neuss</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
