import { TaskStatus } from "@/app/(pages)/tasks/_components/TaskItem";
import { UUID } from "crypto";

export interface ITask {
    id?: UUID | null;
    title: string;
    description?: string;
    status: TaskStatus;
    updatedAt?: string;
    createdAt?: string;
}