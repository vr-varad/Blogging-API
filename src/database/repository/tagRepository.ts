/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Tag } from '../model'
import Logger from '../../utils/logger'

class TagRepository {
    async getAllTags() {
        try {
            const tags = await Tag.find({})
            return tags
        } catch (error) {
            Logger.error(`Error getting comments: ${error}`)
            throw new Error(
                `Error getting comments: ${(error as Error).message}`
            )
        }
    }
}

export default TagRepository
