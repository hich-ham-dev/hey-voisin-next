import { Post } from '@core/domain/entities/Post';
import { IPostRepository } from '@core/domain/repositories/IPostRepository';

export class SearchPostsUseCase {
    constructor(private postRepository: IPostRepository) {}

    async execute(query: string, categoryId?: string, cityId?: string): Promise<Post[]> {
        return this.postRepository.searchPosts(query, categoryId, cityId);
    }
}
