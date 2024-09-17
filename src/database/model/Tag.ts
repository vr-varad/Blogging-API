import mongoose, { Schema } from 'mongoose'

interface TagDoc {
    name: string
}

const TagSchema = new Schema(
    {
        name: { type: String, required: true }
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

const Tag = mongoose.model<TagDoc>('tag', TagSchema)

export default Tag
