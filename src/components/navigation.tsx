'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logoutAction } from '@/app/actions/auth';
import { cn } from '@/lib/utils';

export function Navigation() {
  const pathname = usePathname();

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logoutAction();
    }
  };

  const navItems = [
    {
      href: '/',
      label: 'Dashboard',
      icon: Home,
    },
    {
      href: '/users',
      label: 'Usuarios',
      icon: Users,
    },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600" />
            <span className="text-xl font-bold">Admin Panel</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    className={cn(
                      'gap-2',
                      isActive && 'bg-primary text-primary-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}

            {/* Logout Button */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
