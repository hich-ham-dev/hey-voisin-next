import { User } from '@/core/domain/entities/User';
import { IUserRepository } from '@/core/domain/repositories/IUserRepository';
import { ApiClient } from '../api/ApiClient';

export class ApiUserRepository implements IUserRepository {
    constructor(private apiClient: ApiClient) {}

    async getUserById(id: string): Promise<User | null> {
        try {
            const response = await this.apiClient.get<{ data: User }>(`/users/${id}`);
            return response.data.data;
        } catch (error) {
            return null;
        }
    }

    async updateUserProfile(userId: string, userData: Partial<User>): Promise<User> {
        const response = await this.apiClient.patch<{ data: User }>(`/users/${userId}`, userData);
        return response.data.data;
    }

    async getCurrentUser(): Promise<User | null> {
        try {
            const response = await this.apiClient.get<{ data: User }>('/users/me');
            return response.data.data;
        } catch (error) {
            return null;
        }
    }

    async updateAvatar(userId: string, avatarFile: File): Promise<User> {
        const formData = new FormData();
        formData.append('avatar', avatarFile);

        const response = await this.apiClient.post<{ data: User }>(`/users/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    }
}
