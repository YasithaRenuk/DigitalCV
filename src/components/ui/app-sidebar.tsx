"use client";

import { usePathname } from "next/navigation";
import { Home, Inbox, Users, FileText, LogOut } from "lucide-react";
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

const items = [
  {
    title: "Home",
    url: "/admin",
    icon: Home,
  },
  {
    title: "CV Builder",
    url: "/admin/cv-builder",
    icon: FileText,
  },
  {
    title: "inbox",
    url: "/admin/inbox",
    icon: Inbox,
  },
  {
    title: "users",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "CV's",
    url: "/admin/usercv",
    icon: FileText,
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="h-screen">
      <SidebarContent className="flex flex-col justify-between h-full">
        <div>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col items-center pt-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-[#EFD470] mb-10" />

              {/* Nav items */}
              <SidebarMenu className="flex flex-col gap-6">
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem
                      key={item.title}
                      className={`
                        w-[207px]
                        h-[44px]
                        rounded-[8px]
                        ml-5
                        flex items-center
                        transition-colors
                        ${
                          isActive
                            ? "bg-[#FBEFBF] border border-transparent"
                            : "bg-white border border-[#F1752F] hover:bg-[#FFF5D1]"
                        }
                      `}
                    >
                      <SidebarMenuButton asChild className="w-full h-full px-[23px] py-[10px]">
                        <a href={item.url} className="flex items-center gap-[9px]">
                          {/* Icon box */}
                          <span className="w-6 h-6 rounded-[4px] bg-[#F1752F] flex items-center justify-center">
                            <item.icon size={16} className="text-white" />
                          </span>
                          <span className="text-sm text-black">{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* Logout */}
        <SidebarFooter className="mb-6 flex justify-center">
          <SidebarMenu>
            <SidebarMenuItem className="w-[207px]">
              <SidebarMenuButton asChild className="w-full">
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="
                    w-full
                    h-[44px]
                    rounded-[8px]
                    border border-[#F1752F]
                    bg-white
                    flex items-center
                    px-[23px] py-[10px]
                    gap-[9px]
                    text-sm text-black
                    hover:bg-[#FFF5D1]
                  "
                >
                  <span className="w-6 h-6 rounded-[999px] border border-[#F1752F] flex items-center justify-center">
                    <LogOut size={16} className="text-[#F1752F]" />
                  </span>
                  <span>Logout</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
