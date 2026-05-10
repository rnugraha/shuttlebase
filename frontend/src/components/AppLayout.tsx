import { NavLink, Outlet, useNavigate } from "react-router-dom";

function getEmailFromToken(): string | null {
	const token = localStorage.getItem("token");
	if (!token) return null;
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		return payload.email ?? null;
	} catch {
		return null;
	}
}
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function AppLayout() {
	const navigate = useNavigate();
	const email = getEmailFromToken();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader className="px-4 py-4">
					<span className="font-bold tracking-tight">🏸 Shuttlebase</span>
				</SidebarHeader>

				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild>
										<NavLink to="/members">Members</NavLink>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter className="p-4 space-y-2">
					{email && (
						<p className="text-xs text-muted-foreground truncate px-1">{email}</p>
					)}
					<Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
						Logout
					</Button>
				</SidebarFooter>
			</Sidebar>

			<SidebarInset>
				<header className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
				</header>
				<main className="flex-1 overflow-auto">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
