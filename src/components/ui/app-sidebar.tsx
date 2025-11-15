"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Calendar, Home, Inbox, Search, Settings, LogOut, FileText } from "lucide-react";
import { signOut } from "next-auth/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items
const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "UserCV",
    url: "/admin/usercv",
    icon: FileText,
  }
];

export function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Sidebar
      className={`${
        collapsed ? "w-20" : "w-64"
      } transition-all duration-300 border-r border-gray-200`}
    >
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col items-center md:items-start">
              <SidebarMenu className="w-full gap-5 p-5 items-center justify-center">
                <SidebarMenuItem className="items-center justify-center">
                  <SidebarMenuButton
                    asChild
                    className="w-24 h-24 text-4xl rounded-full bg-orange-200 flex items-center justify-center text-white font-bold overflow-hidden my-4"
                  >
                    {/* User Avatar */}
                    <div
                      className={`w-24 h-24 text-4xl rounded-full bg-orange-200 flex items-center justify-center text-white font-bold overflow-hidden my-4`}
                    >
                      <a href="/">😺</a>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>

              {/* Menu Items */}
              <SidebarMenu className="w-full gap-5 p-5">
                {items.map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`w-full rounded-md p-4 hover:bg-[#ecd377] ${
                        isActive ? "bg-[#ecd377] " : "border-2 border-secondary"
                      }`}
                    >
                      <SidebarMenuButton asChild className="text-xl">
                        <a
                          href={item.url}
                          className={`flex items-center gap-2 px-3 py-2 w-full`}
                        >
                          <item.icon color="#F1752F" size={12} />
                          {!collapsed && <span>{item.title}</span>}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Footer */}
        <SidebarFooter className="mb-4">
          <SidebarMenu>
            <SidebarMenuItem className="w-full">
              <SidebarMenuButton asChild className="p-4">
                <a
                  onClick={() => signOut()}
                  className="flex items-center w-full text-red-600 rounded-md hover:bg-[#ecd377] border-2 border-secondary text-xl "
                >
                  <LogOut />
                  {!collapsed && <span>Logout</span>}
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
