import mongoose, { Schema } from 'mongoose'

interface CommentDoc {
    postId: string
    content: string
    author: string
}

const commentSchema = new Schema(
    {
        blogId: { type: Schema.Types.ObjectId, ref: 'blog' },
        content: { type: String, required: true },
        author: { type: String, required: true }
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
