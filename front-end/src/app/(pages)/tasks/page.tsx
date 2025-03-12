"use client";
import TaskFilter from "@/app/(pages)/tasks/_components/TaskFilter";
import TaskList from "@/app/(pages)/tasks/_components/TaskList";
import { useEffect, useState } from "react";
import TaskModal from "./_components/TaskModal";
import { Button } from "@/components/ui/button";
import { UUID } from "crypto";
import { getTasks, addTask, deleteTask, updateTask } from "@/app/context/api";
import { toast } from "sonner";
import { ITask } from "@/models/ITask";
import { TaskStatus } from "./_components/TaskItem";
import ThemeToggle from "../../../components/Toggle/ThemeToggle";

export default function Home() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast.error("Erro ao carregar os dados", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleStatusChange = async (id: UUID, newStatus: TaskStatus) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === id);
      if (!taskToUpdate) {
        toast.error("Erro: Tarefa não encontrada.");
        return;
      }
      const updatedTaskCurrent: ITask = { ...taskToUpdate, status: newStatus };

      await updateTask(id, updatedTaskCurrent);

      setTasks(tasks.map((task) => (task.id === id ? updatedTaskCurrent : task)));
    } catch (error) {
      toast.error("Erro ao atualizar status da tarefa", {
        description: error instanceof Error ? error.message : "Erro desconhecido.",
      });
    }
  };

  const handleDelete = async (taskId: UUID) => {
    try {
      setLoading(true);
      await deleteTask(taskId);
      await resetStateModal();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      toast.error("Erro ao deletar tarefa", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = (status: string) => {
    setFilter(status);
  };

  const resetStateModal = async () => {
    await getData();
    setCurrentTask(null);
    setTimeout(() => setOpenModal(false), 100);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === TaskStatus.Completed) return task.status === TaskStatus.Completed;
    if (filter === TaskStatus.Pending) return task.status === TaskStatus.Pending;
    return true;
  });

  const handleOpenModal = (task: ITask) => {
    if (!task.id) {
      console.error("Erro: Tentativa de editar uma tarefa sem ID.");
      return;
    }
    setCurrentTask(task);
    setOpenModal(true);
  };

  const handleSubmit = async (data: ITask) => {
    if (!data.title) return;
    setLoading(true);
    try {
      if (data.id) {
        data.updatedAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        data.status = currentTask!.status;
        await updateTask(data.id as UUID, data);
      } else {
        data.createdAt = new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
        await addTask(data);
      }
      await resetStateModal();
    } catch (error: unknown) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModalAdd = () => {
    setCurrentTask(null);
    setOpenModal(true);
  };

  return (
    <div className="h-screen dark:bg-[#1e1e1e] bg-[#f5f5f5] flex flex-col justify-items-start">
      <div className="flex justify-end w-full p-4">
        <ThemeToggle />
      </div>
      <div className="h-full flex justify-center">
        <div className="container flex flex-col justify-center items-center">
          <div className="flex flex-col items-center bg-[#ffffff] dark:bg-[#2d2d2d] rounded-2xl shadow-2xl max-h-[80vh] w-full p-5 border">
            <h1 className="text-4xl">Lista de tarefas</h1>
            <div className="flex w-full justify-between m-2 mb-4">
              <Button className="cursor-pointer bg-[#4CAF50] hover:bg-[#388E3C]" variant="outline" onClick={() => handleOpenModalAdd()}>
                Adicionar
              </Button>
              <TaskModal openModal={openModal} handleOpenModal={setOpenModal} task={currentTask} handleSubmit={(value) => handleSubmit(value as ITask)} loading={loading} />
              <TaskFilter FilterProps={filterTasks} />
            </div>
            <TaskList tasks={filteredTasks} onStatusChange={handleStatusChange} deleteTask={handleDelete} handleEdit={handleOpenModal} />
          </div>
        </div>
      </div>
    </div>
  );
}
