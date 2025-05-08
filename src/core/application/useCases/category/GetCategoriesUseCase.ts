import { Category } from '@core/domain/entities/Category';
import { ICategoryRepository } from '@core/domain/repositories/ICategoryRepository';

export class GetCategoriesUseCase {
    constructor(private categoryRepository: ICategoryRepository) {}

    async execute(): Promise<Category[]> {
        return this.categoryRepository.getCategories();
    }
}
