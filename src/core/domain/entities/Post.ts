import {Category} from "@/core/domain/entities/Category";
import {Author} from "@/core/domain/entities/Author";
import {City} from "@/core/domain/entities/City";

export interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    author: Author;
    category?: Category;
    comments?: Comment[];
    city?: City;
    imageUrl?: string;
}