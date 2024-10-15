import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface LessonCardEditButtonProps {
  editing: boolean;
  confirmLoading?: boolean;
  setEditing: (editing: boolean) => void;
  handleSummitItem?: () => void | undefined;
  handleCancelItem?: () => void | undefined;
}

export default function LessonCardEditButton({ editing, confirmLoading, setEditing, handleSummitItem, handleCancelItem }: LessonCardEditButtonProps) {
  return editing ? 
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleCancelItem} disabled={confirmLoading}>
        Cancel
      </Button>
      <Button onClick={handleSummitItem} disabled={confirmLoading}>
        {confirmLoading ? "Confirming..." : "Confirm"}
      </Button>
    </div> : 
    <Button onClick={() => setEditing(true)}>
      <Pencil className="mr-2 h-4 w-4" />
      Edit
    </Button>
}