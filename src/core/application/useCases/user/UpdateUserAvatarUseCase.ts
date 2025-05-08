import { User } from '@core/domain/entities/User';
import { IUserRepository } from '@core/domain/repositories/IUserRepository';

export class UpdateUserProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(userId: string, userData: Partial<User>): Promise<User> {
        return this.userRepository.updateUserProfile(userId, userData);
    }
}
