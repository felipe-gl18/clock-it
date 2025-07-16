import {
  ChevronUpIcon,
  Home,
  LogOutIcon,
  User2Icon,
  ChartBar,
  Users2,
  User2,
  Coins,
  Users,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useFirebaseStorage } from "@/hooks/useFirebaseStorage";
import { useAuthentication } from "@/hooks/useAuthentication";
import { useState } from "react";
import AuthenticatedUserWrapper from "./authenticated-user-wrapper";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Graphics",
    url: "/settings",
    icon: ChartBar,
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users2,
  },
];

export function AppSidebar() {
  const { user } = useAuthentication();
  const { logOut } = useFirebaseStorage();
  const handleLogout = async () => await logOut();

  const [openUser, setOpenUser] = useState(false);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2Icon /> {user?.displayName}
                  <ChevronUpIcon className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => setOpenUser(true)}
                  >
                    <User2 />
                    Account
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={true}>
                    <Coins />
                    Billing
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled={true}>
                    <Users />
                    Team
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOutIcon />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            {openUser && (
              <AuthenticatedUserWrapper
                user={user!}
                open={openUser}
                onOpenChange={setOpenUser}
              />
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
