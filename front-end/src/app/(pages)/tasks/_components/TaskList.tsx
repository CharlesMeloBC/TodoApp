import { UUID } from "crypto";
import TaskItem, {TaskStatus} from "./TaskItem";
import { ITask } from "@/models/ITask";

interface TaskListProps {
    tasks:ITask[];
    onStatusChange: (id: UUID, newStatus: TaskStatus) => void;
    deleteTask:(id: UUID)=> void;
    handleEdit:(task:ITask)=>void;
}

export default function TaskList({tasks, onStatusChange, deleteTask, handleEdit}: TaskListProps) {

    return (
      <div className="w-full max-w-[90vw] h-full flex flex-col bg-[#d8d5d58a] dark:bg-zinc-800 rounded items-center overflow-auto overflow-x-hidden custom-scrollbar p-4 gap-1">
        {tasks.length > 0 ? 
        tasks.map(task => (
          <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={deleteTask} handleEdit={handleEdit}/>)):
          <p className="font-light italic">Nenhuma tarefa para exibir...</p>
        }
      </div>
    );
  }