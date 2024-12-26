"use client";

import {useTheme} from "next-themes";
import {DropdownMenu, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuContent} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {SunIcon, MoonIcon, SunMoon} from "lucide-react"
import {useEffect, useState} from "react";

const ModeToggle = () => {
	const [mounted, setMounted] = useState(false);
	const {theme, setTheme} = useTheme();
	
	useEffect(() => {
		setMounted(true)
	}, []);
	
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost">
					{theme === "system" ? <SunMoon /> : theme === "dark" ? <MoonIcon /> : <SunIcon />}
				</Button>
			</DropdownMenuTrigger>
		</DropdownMenu>
	);
};

export default ModeToggle;