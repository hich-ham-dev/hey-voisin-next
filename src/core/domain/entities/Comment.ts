import {Author} from "@/core/domain/entities/Author";

export interface Comment {
    id: string;
    content: string;
    author: Author;
    createdAt: Date;
    updatedAt?: Date;
}