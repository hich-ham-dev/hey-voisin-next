import { Category } from '@/core/domain/entities/Category';
import { ICategoryRepository } from '@/core/domain/repositories/ICategoryRepository';
import { ApiClient } from '../api/ApiClient';

export class ApiCategoryRepository implements ICategoryRepository {
    constructor(private apiClient: ApiClient) {}

    async getCategories(): Promise<Category[]> {
        const response = await this.apiClient.get<{ data: Category[] }>('/categories');
        return response.data.data;
    }
}
