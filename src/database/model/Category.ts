import mongoose, { Schema } from 'mongoose'

interface CategoryDoc {
    name: string
    description: string
}

const CategorySchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, rel) {
                delete rel._v
                delete rel.createdAt
                delete rel.updatedAt
            }
        }
    }
)

const Category = mongoose.model<CategoryDoc>('category', CategorySchema)

export default Category
