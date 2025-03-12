import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ITask } from "@/models/ITask";
import { formatDateToBrazilian } from "@/utils/formatDate";
import { UUID } from "crypto";
import { Trash, Pencil } from "lucide-react";

export enum TaskStatus {
  Completed = "Completed",
  Pending = "Pending"
}

interface TaskItemProps {
  task: ITask;
  onStatusChange: (id: UUID, newStatus: TaskStatus) => void;
  onDelete: (id: UUID) => void;
  handleEdit: (task: ITask) => void;
}

export default function TaskItem({ task, onStatusChange, onDelete, handleEdit }: TaskItemProps) {

  const handleCheckboxChange = () => {
    const newStatus = task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed;
    onStatusChange(task.id!, newStatus);
  };

  return (
    <div className="flex container sm:flex-row justify-between items-center sm:items-center p-2 mb-2 shadow bg-[#ffffff] dark:bg-[#2d2d2d] rounded hover:-translate-1 transition-transform duration-300 hover:shadow-2xl cursor-pointer">
      <div className="flex w-full gap-2 items-center">
        <Checkbox checked={task.status === TaskStatus.Completed} onCheckedChange={handleCheckboxChange} className="w-6 h-6 overflow-x-auto" />
        <div onClick={handleCheckboxChange} className="flex w-full flex-col items-start justify-center gap-1">
          <h3 title={task.title} className={`${task.status === "Completed" ? "line-through" : ""} font-medium truncate max-w-[193px] sm:max-w-full overflow-hidden`}>{task.title}</h3>
          <small title={task.description} className="truncate max-w-[193px] sm:max-w-full h-5 p-1 rounded flex items-center overflow-hidden">{task.description}</small>
          <small className="font-mono" >{formatDateToBrazilian(new Date(task.createdAt!))}</small>
        </div>
      </div>
      <div className="actions flex gap-2 w-fit flex-col sm:flex-row">
        <Button onClick={() => handleEdit(task)} className="cursor-pointer bg-blue-500 hover:bg-blue-800 border-none" variant="outline"><Pencil size={16} /></Button>
        <Button onClick={() => onDelete(task.id!)} className="cursor-pointer hover:bg-red-800 border-none" variant="destructive"><Trash size={16} /></Button>
      </div>
    </div>
  );
}
