import { StackContext, Api, StaticSite, Bucket } from "sst/constructs";

export function API({ stack }: StackContext) {
	const audience = `api-tunelite-${stack.stage}`;
	const assetsBucket = new Bucket(stack, "assets");

	const api = new Api(stack, "api", {
		authorizers: {
			myAuthorizer: {
				type: "jwt",
				jwt: {
					issuer: "https://tunelite.kinde.com",
					audience: [audience],
				},
			},
		},
		defaults: {
			authorizer: "myAuthorizer",
			function: {
				environment: {
					DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL!,
				},
			},
		},
		routes: {
			"GET /": {
				authorizer: "none",
				function: {
					handler: "packages/functions/src/lambda.handler",
				},
			},
			"GET /playlists": {
				authorizer: "none",
				function: {
					handler: "packages/functions/src/playlists.handler",
				},
			},
			"POST /playlists": "packages/functions/src/playlists.handler",
			"GET /playlists/{id}": "packages/functions/src/playlists.handler",
			"DELETE /playlists/{id}": "packages/functions/src/playlists.handler",
			"GET /playlists/{id}/songs": "packages/functions/src/playlists.handler",
			"POST /playlists/{id}/songs": "packages/functions/src/playlists.handler",
			"DELETE /playlists/{id}/songs/{songId}":
				"packages/functions/src/playlists.handler",
			"POST /signed-url": {
				function: {
					environment: {
						ASSETS_BUCKET_NAME: assetsBucket.bucketName,
					},
					handler: "packages/functions/src/s3.handler",
				},
			},
			"GET /csharp": {
				authorizer: "none",
				function: {
					handler: "packages/csharp/ApiDotnet",
					runtime: "container",
				},
			},
		},
	});

	api.attachPermissionsToRoute("POST /signed-url", [assetsBucket, "grantPut"]);

	const web = new StaticSite(stack, "web", {
		path: "packages/web",
		buildOutput: "dist",
		buildCommand: "npm run build",
		environment: {
			VITE_APP_API_URL: api.url,
			VITE_APP_KINDE_AUDIENCE: audience,
		},
	});

	stack.addOutputs({
		ApiEndpoint: api.url,
		WebsiteURL: web.url,
	});
}
