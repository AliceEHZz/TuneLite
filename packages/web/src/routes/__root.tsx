import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { AudioLines, ChevronsDown } from "lucide-react";
import { PlaylistsFetcher } from "@/components/playlists-fetcher";
import { Separator } from "@/components/ui/separator";

export const Route = createRootRoute({
	component: () => (
		<>
			<div className="grid max-h-dvh w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
				<div className="hidden border-r bg-muted/40 md:block">
					<div className="flex h-dvh max-h-dvh flex-col gap-2">
						<div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
							<div className="flex items-center gap-2 text-2xl font-bold">
								<AudioLines className="h-30 w-30" />
								<span>TuneLite</span>
							</div>
						</div>
						<div className="flex-1">
							<nav className="grid items-start px-2 text-sm font-medium lg:px-4">
								<Link
									to="/"
									className="flex items-center gap-2=3 px-3 py-2 text-lg font-bold text-muted-foreground transition-all hover:text-primary data-[status=active]:text-primary"
								>
									<span>Home</span>
								</Link>
								<Link
									to="/create-playlist"
									className="flex items-center gap-2=3 px-3 py-2 text-lg font-bold text-muted-foreground transition-all hover:text-primary data-[status=active]:text-primary"
								>
									Create
								</Link>
								<Link
									to="/about"
									className="flex items-center gap-2=3 px-3 py-2 text-lg font-bold text-muted-foreground transition-all hover:text-primary data-[status=active]:text-primary"
								>
									About
								</Link>
								<div className="mt-10">
									<Separator />
								</div>
								<div className="mt-5">
									<h1 className="flex items-center gap-2=3 px-3 py-2 text-lg font-bold text-muted-foreground">
										All Playlists
										<ChevronsDown className="h-6 w-6 ml-2" />
									</h1>

									<PlaylistsFetcher />
								</div>
							</nav>
						</div>
					</div>
				</div>
				<div className="flex flex-col p-20">
					<Outlet />
				</div>
			</div>
		</>
	),
});
