import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { AudioLines } from "lucide-react";
export const Route = createFileRoute("/about")({
	component: AboutPage,
});

function AboutPage() {
	return (
		<div className="max-w-lg mx-auto p-8 shadow-md rounded-md text-center">
			<p>This page provides information about TuneLite and its features.</p>
			<div className="my-6">
				<Separator />
			</div>
			<div className="flex flex-col items-center justify-center mb-4">
				<AudioLines className="h-16 w-16 mb-2" />
				<h1 className="text-3xl font-bold">About TuneLite</h1>
			</div>
			<p className="text-lg mb-4">
				TuneLite is a minimal playlist app. The current stage allows users to
				create playlists and add songs to the playlists after logging in.
			</p>
			<h3 className="text-2xl">Future releases</h3>
			<p>Future releases will include a music player for the songs. </p>
		</div>
	);
}
