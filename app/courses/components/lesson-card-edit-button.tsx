import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";

interface LessonCardEditButtonProps {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  handleSummitItem?: () => void | undefined;
}

export default function LessonCardEditButton({ editing, setEditing, handleSummitItem }: LessonCardEditButtonProps) {
  return editing ? 
    <Button
      onClick={() => {
        handleSummitItem?.();
        setEditing(false);
      }}>
      Confirm
    </Button> : 
    <Button onClick={() => setEditing(true)}>
      <Pencil1Icon className="size-4 mr-2" />
      Edit
    </Button>
}