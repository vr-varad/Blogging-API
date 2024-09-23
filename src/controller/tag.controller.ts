/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { TagService } from '../services'
import Logger from '../utils/logger'
import { CreateTagInput } from '../dto/Tag'

const tagService = new TagService()

const createTag = async (req: Request, res: Response) => {
    try {
        const { name }: CreateTagInput = req.body
        const tag = await tagService.CreateTag(name)
        return res.status(201).json({
            success: true,
            tag
        })
    } catch (error) {
        Logger.error(`Error during creating tag: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error creating tag',
            error: (error as Error).message
        })
    }
}

const getAllTags = async (req: Request, res: Response) => {
    try {
        const tags = await tagService.GetAllTags()
        return res.status(201).json({
            success: true,
            tags
        })
    } catch (error) {
        Logger.error(`Error during getting tag: ${(error as Error).message}`)
        return res.status(500).json({
            success: false,
            message: 'Error getting tag',
            error: (error as Error).message
        })
    }
}

export { createTag, getAllTags }
