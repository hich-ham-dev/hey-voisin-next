import { User } from '@core/domain/entities/User';
import { IUserRepository } from '@core/domain/repositories/IUserRepository';

export class GetUserProfileUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User | null> {
        return this.userRepository.getCurrentUser();
    }
}
