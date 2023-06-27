class CreatePostDto {
    author: string;
    date = new Date();
    public = true;
    tags: string;
    text: string;
}

export { CreatePostDto };
