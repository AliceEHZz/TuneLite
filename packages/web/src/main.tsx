import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { KindeProvider } from "@kinde-oss/kinde-auth-react";

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<KindeProvider
			audience={import.meta.env.VITE_APP_KINDE_AUDIENCE}
			clientId="f7e2a122767741419b08cef0de9f8ed8"
			domain="https://tunelite.kinde.com"
			logoutUri={window.location.origin}
			redirectUri={window.location.origin}
		>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</KindeProvider>
	</React.StrictMode>
);
