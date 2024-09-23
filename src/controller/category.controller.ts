/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Request, Response } from 'express'
import { CategoryService } from '../services'
import Logger from '../utils/logger'
import { CreateCategoryInputs } from '../dto/Category'

const categoryService = new CategoryService()

const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, description }: CreateCategoryInputs = req.body
        const category = await categoryService.CreateCategory(name, description)
        return res.status(201).json({
            success: true,
            category
        })
    } catch (error) {
        Logger.error(
            `Error during creating category: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: (error as Error).message
        })
    }
}

const getAllCategory = async (req: Request, res: Response) => {
    try {
        const category = await categoryService.GetAllCategory()
        return res.status(201).json({
            success: true,
            category
        })
    } catch (error) {
        Logger.error(
            `Error during getting category: ${(error as Error).message}`
        )
        return res.status(500).json({
            success: false,
            message: 'Error getting category',
            error: (error as Error).message
        })
    }
}

export { createCategory, getAllCategory }
