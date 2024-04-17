import { Row } from "@tanstack/react-table";
import { Button } from "./ui/button";

interface SongDeleteActionProps<TData> {
	row: Row<TData>;
	onDelete: (value: TData) => void;
}

const SongDeleteAction = <TData,>({
	row,
	onDelete,
}: SongDeleteActionProps<TData>) => {
	return <Button onClick={() => onDelete(row.original)}>Delete</Button>;
};

export default SongDeleteAction;
