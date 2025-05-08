import { User } from '../entities/User';

export interface IUserRepository {
    getUserById(id: string): Promise<User | null>;
    updateUserProfile(userId: string, userData: Partial<User>): Promise<User>;
    getCurrentUser(): Promise<User | null>;
    updateAvatar(userId: string, avatarFile: File): Promise<User>;
}
