import { Post } from '@/core/domain/entities/Post';
import { IPostRepository } from '@/core/domain/repositories/IPostRepository';
import { ApiClient } from '../api/ApiClient';

export class ApiPostRepository implements IPostRepository {
    constructor(private apiClient: ApiClient) {}

    async getPosts(page: number = 1, limit: number = 10): Promise<Post[]> {
        const response = await this.apiClient.get<{ data: Post[] }>('/posts', {
            params: { page, limit }
        });
        return response.data.data;
    }

    async getPostById(id: string): Promise<Post | null> {
        try {
            const response = await this.apiClient.get<{ data: Post }>(`/posts/${id}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    }

    async searchPosts(query: string, categoryId?: string, cityId?: string): Promise<Post[]> {
        const response = await this.apiClient.get<{ data: Post[] }>('/posts/search', {
            params: { q: query, category: categoryId, city: cityId }
        });
        return response.data.data;
    }
}
