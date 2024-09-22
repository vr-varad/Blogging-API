/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { TagRepository } from '../database'
import Logger from '../utils/logger'

class TagService {
    readonly tagRepository: TagRepository

    constructor() {
        this.tagRepository = new TagRepository()
    }

    async CreateTag(name: string) {
        try {
            const tag = await this.tagRepository.createTags(name)
            return tag
        } catch (error) {
            Logger.error(`Error Creating Tags: ${error}`)
            throw new Error(`Error Creating Tags: ${(error as Error).message}`)
        }
    }

    async GetAllTags() {
        try {
            const tags = await this.tagRepository.getAllTags()
            return tags
        } catch (error) {
            Logger.error(`Error Creating Tags: ${error}`)
            throw new Error(`Error Creating Tags: ${(error as Error).message}`)
        }
    }
}

export default TagService
