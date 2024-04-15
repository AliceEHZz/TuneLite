// import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

export function useDeletePlaylist() {
	// const { getToken } = useKindeAuth();
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { mutate, error, isPending } = useMutation({
		mutationFn: async (id: string) => {
			// const token = await getToken();
			// if (!token) {
			// 	throw new Error("No token found.");
			// }
			await fetch(`${import.meta.env.VITE_API_URL}/playlists/${id}`, {
				method: "DELETE",
				headers: {
					// Authorization: token,
					"Content-Type": "application/json",
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["getPlaylists"] });
			navigate({ to: "/" });
		},
	});

	return { deletePlaylist: mutate, error, isDeletingPlaylist: isPending };
}
