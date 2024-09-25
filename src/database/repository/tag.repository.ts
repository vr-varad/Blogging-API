/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Tag } from '../model'
import Logger from '../../utils/logger'

class TagRepository {
    async createTags(name: string) {
        try {
            const tags = await Tag.create({
                name
            })
            return tags
        } catch (error) {
            Logger.error(`Error creating tags: ${error}`)
            throw new Error(`Error creating tags: ${(error as Error).message}`)
        }
    }
    async getTagByName(tagName: string) {
        try {
            const tag = await Tag.findOne({
                name: tagName
            })
            if (!tag) {
                Logger.warn(`Tag with name ${tagName} not found`)
                return null
            }
            return tag
        } catch (error) {
            Logger.error(`Error getting tags: ${error}`)
            throw new Error(`Error getting tags: ${(error as Error).message}`)
        }
    }
    async getAllTags() {
        try {
            const tags = await Tag.find({})
            return tags
        } catch (error) {
            Logger.error(`Error getting tags: ${error}`)
            throw new Error(`Error getting tags: ${(error as Error).message}`)
        }
    }
}

export default TagRepository
