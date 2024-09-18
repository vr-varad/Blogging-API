/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Category } from '../model'
import Logger from '../../utils/logger'

class CategoryRepository {
    async getAllCategory() {
        try {
            const category = await Category.find({})
            return category
        } catch (error) {
            Logger.error(`Error getting comments: ${error}`)
            throw new Error(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }
}

export default CategoryRepository
