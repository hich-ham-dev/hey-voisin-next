import { Post } from '@core/domain/entities/Post';
import { IPostRepository } from '@core/domain/repositories/IPostRepository';

export class GetPostsUseCase {
    constructor(private postRepository: IPostRepository) {}

    async execute(page: number = 1, limit: number = 10): Promise<Post[]> {
        return this.postRepository.getPosts(page, limit);
    }
}
