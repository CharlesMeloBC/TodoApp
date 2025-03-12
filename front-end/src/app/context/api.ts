import axios from "axios";
import { UUID } from "crypto";
import { ITask } from "@/models/ITask";

const API_URL = "http://localhost:5000/tasks";

const getAuthToken = (): string | null => {
  
  console.log("token JWT " ,localStorage.getItem("authToken"))
  return localStorage.getItem("authToken");  
};

export const getTasks = async (): Promise<ITask[]> => {
  try {
    const token = getAuthToken();
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    throw error;
  }
};

export const addTask = async (task: ITask): Promise<ITask> => {
  try {
    const token = getAuthToken();
    const response = await axios.post(API_URL, task, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    throw error;
  }
};

export const updateTask = async (id: UUID, updatedTask: ITask) => {
  try {
    const token = getAuthToken();
    const response = await axios.put(`${API_URL}/${id}`, updatedTask, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const token = getAuthToken();
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    throw error;
  }
};
