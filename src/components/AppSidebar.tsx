import { Home, FileText, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from '@/components/ui/sidebar';

const prefix = '/dashboard'
const items = [
		{
			title: 'Home',
			url: '/',
			icon: Home,
		},
		{
			title: 'Invoices',
			url: '/invoices',
			icon: FileText,
			subItems: [
				{
					title: 'Clients',
					url: '/clients',
				},
				{
					title: 'Article',
					url: '/articles',
				},
			],
		},
		{
			title: 'Cashflow',
			url: '/cashflow',
			icon: DollarSign,
		},
	];

function AppSidebar() {
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
									<Link to={prefix +item.url}>
										<item.icon />
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
								{item.subItems && (
									<SidebarMenuSub>
										{item.subItems.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton asChild>
													<Link to={prefix + subItem.url}>
														<span>{subItem.title}</span>
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								)}
							</SidebarMenuItem>
						))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

export default AppSidebar;
