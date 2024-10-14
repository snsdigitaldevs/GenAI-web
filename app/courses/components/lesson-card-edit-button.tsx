import { Button } from "@/components/ui/button";

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
    </Button> : <Button onClick={() => setEditing(true)}>Edit</Button>
}