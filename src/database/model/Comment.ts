import mongoose, { Schema } from 'mongoose'

interface CommentDoc {
    blogId: string
    content: string
    authorId: mongoose.Types.ObjectId
}

const commentSchema = new Schema(
    {
        blogId: { type: Schema.Types.ObjectId, ref: 'blog' },
        content: { type: String, required: true },
        authorId: { type: Schema.Types.ObjectId, ref: 'user', required: true }
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
