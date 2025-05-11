"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, User, Bell, MessageSquare, PlusCircle, LogIn, LayoutGrid } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const navItems = [
  { href: '/', label: 'Feed', icon: Home },
  { href: '/notifications', label: 'Notifications', icon: Bell, requiresAuth: true },
  { href: '/messages', label: 'Messages', icon: MessageSquare, requiresAuth: true },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, logout } = useCurrentUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center space-x-2">
            <LayoutGrid className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Linkdrop</span>
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1 p-4">
        {navItems.map((item) => {
          if (item.requiresAuth && !user) return null;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton isActive={isActive} variant="default" size="default" className="w-full justify-start">
                  <item.icon className="mr-2 h-5 w-5" />
                  {item.label}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
         {user && (
          <SidebarMenuItem>
            <Link href="/post/create" legacyBehavior passHref>
              <SidebarMenuButton isActive={pathname === '/post/create'} variant="default" size="default" className="w-full justify-start">
                <PlusCircle className="mr-2 h-5 w-5" />
                New Link
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        )}
      </SidebarMenu>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {user ? (
          <div className="flex flex-col gap-2">
             <Link href={`/profile/${user.id}`} passHref legacyBehavior>
                <a className="flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatarUrl || undefined} alt={user.name || 'User'} data-ai-hint="profile avatar" />
                      <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                </a>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login" passHref legacyBehavior>
             <Button variant="default" className="w-full">
                <LogIn className="mr-2 h-5 w-5" />
                Login / Sign Up
            </Button>
          </Link>
        )}
      </SidebarFooter>
    </>
  );
}
