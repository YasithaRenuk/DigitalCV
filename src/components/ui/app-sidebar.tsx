"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Inbox,
  Users,
  FileText,
  LogOut,
  BadgeDollarSign,
} from "lucide-react";
import { signOut,useSession } from "next-auth/react";

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
import Link from "next/link";

const items = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "CV Builder", url: "/admin/cv-builder", icon: FileText },
  { title: "Inbox", url: "/admin/inbox", icon: Inbox },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "CVs", url: "/admin/usercv", icon: FileText },
  { title: "Payments", url: "/admin/payments", icon: BadgeDollarSign },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <Sidebar className="h-screen bg-[#F5F6F7] border-r w-[260px]">
      <SidebarContent className="flex flex-col justify-between h-full">

        {/* TOP */}
        <div>
          <SidebarGroup>
            <SidebarGroupContent className="flex flex-col items-center pt-8 pb-6">

              {/* Profile Header */}
              <div className="flex flex-col items-center text-center">
                <Link href="/">
                  <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center text-3xl overflow-hidden">
                    {session?.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session?.user.name? session?.user.name : " "}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      "😺"
                    )}
                  </div>
                </Link>
                <h2 className="font-semibold text-lg mt-2">
                  {session?.user.name}
                </h2>
                <p className="text-sm text-gray-500">Admin</p>
              </div>

              {/* Menu */}
              <SidebarMenu className="mt-8 w-full px-4 space-y-2">
                {items.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg text-sm
                            transition
                            ${
                              isActive
                                ? "bg-orange-100 text-orange-600 font-medium"
                                : "text-gray-600 hover:bg-gray-200"
                            }
                          `}
                        >
                          <item.icon size={18} />
                          {item.title}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        {/* BOTTOM */}
        <SidebarFooter className="px-6 pb-6">
          <div className="border-t mb-4"></div>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 text-sm text-gray-600 hover:text-orange-600 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </SidebarFooter>

      </SidebarContent>
    </Sidebar>
  );
}
