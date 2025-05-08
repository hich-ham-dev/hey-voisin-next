import { City } from '@/core/domain/entities/City';
import { ICityRepository } from '@/core/domain/repositories/ICityRepository';
import { ApiClient } from '../api/ApiClient';

export class ApiCityRepository implements ICityRepository {
    constructor(private apiClient: ApiClient) {}

    async getCities(query?: string): Promise<City[]> {
        const response = await this.apiClient.get<{ data: City[] }>('/cities', {
            params: query ? { q: query } : undefined
        });
        return response.data.data;
    }

    async getCityById(id: string): Promise<City | null> {
        try {
            const response = await this.apiClient.get<{ data: City }>(`/cities/${id}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    }
}
