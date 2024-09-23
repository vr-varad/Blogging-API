export interface CreateBlogInputs {
    title: string
    content: string
    category: Array<string>
    tags: Array<string>
}

export interface UpdateBlogInputs {
    title: string
    content: string
    category: string
}

export interface AddCommentInputs {
    content: string
}
