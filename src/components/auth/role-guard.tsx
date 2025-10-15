'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserDataAction } from '@/app/actions/profile';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

export function RoleGuard({ children, allowedRoles, redirectTo = '/home' }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const result = await getUserDataAction();
      
      if (result.success && result.data) {
        const userRole = result.data.role;
        
        if (allowedRoles.includes(userRole)) {
          setIsAuthorized(true);
        } else {
          // Usuario no autorizado, redirigir
          router.push(redirectTo);
        }
      } else {
        // No hay sesión, redirigir a login
        router.push('/login');
      }
    } catch (error) {
      console.error('Error al verificar rol:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
