import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useCallback } from "react";
import { ITask } from "@/models/ITask";
import { TaskStatus } from "./TaskItem";

interface TaskFormProps {
  handleSubmit: (task: ITask) => void;
  handleOpenModal: (status: boolean) => void;
  task?: ITask | null;
  openModal: boolean;
  loading?: boolean;
}

const taskSchema = z.object({
  title: z.string()
    .min(3, { message: "O título precisa ter pelo menos 3 caracteres" })
    .max(50, { message: "O título pode ter no máximo 50 caracteres" }),
  description: z.string()
    .max(200, { message: "A descrição pode ter no máximo 200 caracteres" })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type TaskFormData = z.infer<typeof taskSchema>;

export default function TaskModal({ loading, handleSubmit, handleOpenModal, openModal, task }: TaskFormProps) {
  const { register, handleSubmit: handleFormSubmit, reset, formState: { errors } } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      createdAt: "", 
      updatedAt: "",   
    },
  });

  const loadTaskData = useCallback((task: ITask) => {
    reset({
      title: task.title,
      description: task.description,
    });
  }, [reset])

  const clearFormData = useCallback(() => {
    reset({
      title: "",
      description: "",
    });
  }, [reset]);

  useEffect(() => {
    if (openModal && task) {
      loadTaskData(task);
    } else {
      clearFormData();
    }
  }, [openModal, task, clearFormData, loadTaskData]);

  return (
    <Dialog open={openModal} onOpenChange={handleOpenModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex justify-center">
            {task ? "Editar Tarefa" : "Adicionar Tarefa"}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleFormSubmit((data) => {
            handleSubmit({ ...data, status:TaskStatus.Pending, id: task && task!.id ? task!.id : null });
            handleOpenModal(false);
          })}
        >
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Input
                disabled={loading}
                {...register("title")}
                placeholder="Título da tarefa"
              />
              {errors.title && (
                <span className="text-red-500 text-sm">{errors.title.message}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Textarea
                disabled={loading}
                {...register("description")}
                placeholder="Descrição da tarefa"
              />
              {errors.description && (
                <span className="text-red-500 text-sm">{errors.description.message}</span>
              )}
            </div>
            <Button disabled={loading} type="submit" className={`px-3 cursor-pointer ${task?"bg-blue-400":"bg-green-400"}`}>
              {task ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </form>
        <DialogFooter className="sm:justify-start"></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
