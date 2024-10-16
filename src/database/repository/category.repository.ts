/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Category } from '../model'
import Logger from '../../utils/logger'
import { DatabaseError } from '../../utils/errorHandler'

class CategoryRepository {
    async createNewCategory(name: string, description: string) {
        try {
            const category = await Category.create({
                name,
                description
            })
            return category
        } catch (error) {
            Logger.error(`Error creating category: ${error}`)
            throw new DatabaseError(
                `Error creating category: ${(error as Error).message}`
            )
        }
    }

    async getCategoryByName(catecoryName: string) {
        try {
            const category = await Category.findOne({
                name: catecoryName
            })
            if (!category) {
                Logger.warn(`Category with Name ${catecoryName} not found`)
                return null
            }
            return category
        } catch (error) {
            Logger.error(`Error getting category by name: ${error}`)
            throw new DatabaseError(
                `Error getting category: ${(error as Error).message}`
            )
        }
    }
    async getAllCategory() {
        try {
            const category = await Category.find({})
            return category
        } catch (error) {
            Logger.error(`Error getting categories: ${error}`)
            throw new DatabaseError(
                `Error getting catecory: ${(error as Error).message}`
            )
        }
    }
}

export default CategoryRepository
