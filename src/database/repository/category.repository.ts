/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Category } from '../model'
import Logger from '../../utils/logger'
import redisClient from '../../utils/redisClient'

class CategoryRepository {
    async createNewCategory(name: string, description: string) {
        try {
            const category = await Category.create({
                name,
                description
            })
            await redisClient.del('blogs')
            return category
        } catch (error) {
            Logger.error(`Error creating category: ${error}`)
            throw new Error(
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
            Logger.error(`Error getting category: ${error}`)
            throw new Error(
                `Error getting category: ${(error as Error).message}`
            )
        }
    }
    async getAllCategory() {
        try {
            const category = await Category.find({})
            return category
        } catch (error) {
            Logger.error(`Error getting category: ${error}`)
            throw new Error(
                `Error getting catecory: ${(error as Error).message}`
            )
        }
    }
}

export default CategoryRepository
