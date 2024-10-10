/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { CategoryRepository } from '../database'
import { ServiceError } from '../utils/errorHandler'
import Logger from '../utils/logger'

class CategoryService {
    readonly categoryRepository: CategoryRepository
    constructor() {
        this.categoryRepository = new CategoryRepository()
    }

    async CreateCategory(name: string, description: string) {
        try {
            const category = await this.categoryRepository.createNewCategory(
                name,
                description
            )
            return category
        } catch (error) {
            Logger.error(`Error Creating Category: ${error}`)
            throw new ServiceError(
                `Error Creating Category: ${(error as Error).message}`
            )
        }
    }

    async GetAllCategory() {
        try {
            const categories = await this.categoryRepository.getAllCategory()
            return categories
        } catch (error) {
            Logger.error(`Error Getting Categories: ${error}`)
            throw new ServiceError(
                `Error Getting Categories: ${(error as Error).message}`
            )
        }
    }
}

export default CategoryService
