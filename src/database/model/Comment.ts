import mongoose, { Schema } from 'mongoose'

interface CommentDoc {
    blogId: string
    content: string
    authorId: string
}

const commentSchema = new Schema(
    {
        blogId: { type: Schema.Types.ObjectId, ref: 'blog' },
        content: { type: String, required: true },
        authorId: { type: String, required: true }
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

const Comment = mongoose.model<CommentDoc>('comment', commentSchema)

export default Comment
