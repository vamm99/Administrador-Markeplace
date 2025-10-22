'use client'
import { useState, useEffect } from "react"
import { Box, Home, Users, LogOut, UserCircle, FolderOpen, ShoppingCart, Package } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { getUserDataAction } from "@/app/actions/profile"

// Menu items.
const allItems = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
    roles: ['admin', 'seller', 'customer'], // Todos
  },
  {
    title: "Mi Perfil",
    url: "/profile",
    icon: UserCircle,
    roles: ['admin', 'seller', 'customer'], // Todos
  },
  {
    title: "Usuarios",
    url: "/users",
    icon: Users,
    roles: ['admin'], // Solo admin
  },
  {
    title: "Productos",
    url: "/products",
    icon: Box,
    roles: ['admin', 'seller'], // Admin y seller
  },
  {
    title: "Categorías",
    url: "/categories",
    icon: FolderOpen,
    roles: ['admin', 'seller'], // Admin y seller
  },
  {
    title: "Ventas",
    url: "/sales",
    icon: ShoppingCart,
    roles: ['admin', 'seller'], // Admin y seller
  },
  {
    title: "Inventario",
    url: "/inventory",
    icon: Package,
    roles: ['admin', 'seller'], // Admin y seller
  }
]

export function AppSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [items, setItems] = useState(allItems);

  useEffect(() => {
    loadUserRole();
  }, []);

  const loadUserRole = async () => {
    const result = await getUserDataAction();
    if (result.success && result.data) {
      const role = result.data.role;
      setUserRole(role);
      // Filtrar items según el rol
      const filteredItems = allItems.filter(item => 
        item.roles.includes(role)
      );
      setItems(filteredItems);
    }
  };
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold justify-center p-10">MonterPlace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild
                  isActive={pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url))}
                  tooltip={item.title}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-gray-100">
              <Link href="/logout">
                <LogOut />
                <span>Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter> */}
    </Sidebar>
  )
}