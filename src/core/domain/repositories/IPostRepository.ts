import { Post } from '../entities/Post';

export interface IPostRepository {
    getPosts(page?: number, limit?: number): Promise<Post[]>;
    getPostById(id: string): Promise<Post | null>;
    searchPosts(query: string, categoryId?: string, cityId?: string): Promise<Post[]>;
}
