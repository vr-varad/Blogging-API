import mongoose, { Schema } from 'mongoose'

interface UserDoc {
    username: string
    bio: string
    email: string
    passwordhash: string
    salt: string
    role: string
}

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        bio: { type: String },
        email: { type: String, required: true, unique: true },
        passwordhash: { type: String, required: true },
        salt: { type: String, required: true },
        role: {
            type: String,
            enum: ['admin', 'user', 'editor'],
            default: 'user'
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, rel) {
                delete rel.__v
                delete rel.createdAt
                delete rel.updatedAt
            }
        }
    }
)

const User = mongoose.model<UserDoc>('user', userSchema)

export default User
