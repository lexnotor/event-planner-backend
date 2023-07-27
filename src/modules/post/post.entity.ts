import { DefaultEntity } from "@/utils/entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    Relation,
} from "typeorm";
import { UserEntity } from "../user/user.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { CommentEntity } from "../comment/comment.entity";

@Entity("post", { orderBy: { created_at: "DESC" } })
class PostEntity extends DefaultEntity {
    @Column("varchar")
    author: string;

    @Column("varchar")
    text: string;

    @Column("boolean")
    public: boolean;

    @Column("timestamp")
    date: Date;

    @Column("integer")
    likes: number;

    @Column("varchar")
    tags: string;

    @ManyToOne(() => UserEntity, (user) => user.posts)
    @JoinColumn({ name: "user_id" })
    user?: Relation<UserEntity>;

    @OneToMany(() => PostPhotoEntity, (post_photo) => post_photo.post, {
        cascade: true,
    })
    post_photo?: Relation<PostPhotoEntity[]>;

    @OneToMany(() => PostCommentEntity, (post_comment) => post_comment.post, {
        cascade: true,
    })
    post_comment?: Relation<PostCommentEntity[]>;
}

@Entity("post_photo")
class PostPhotoEntity extends DefaultEntity {
    @ManyToOne(() => PostEntity)
    @JoinColumn({ name: "post_id" })
    post?: Relation<PostEntity>;

    @ManyToOne(() => PhotoEntity, { cascade: true })
    @JoinColumn({ name: "photo_id" })
    photo?: Relation<PhotoEntity>;
}

@Entity("post_comment")
class PostCommentEntity extends DefaultEntity {
    @ManyToOne(() => PostEntity)
    @JoinColumn({ name: "post_id" })
    post?: Relation<PostEntity>;

    @OneToOne(() => CommentEntity, { cascade: true })
    @JoinColumn({ name: "comment_id" })
    comment?: Relation<CommentEntity>;

    getComment() {
        return this.comment;
    }
}

export { PostEntity, PostPhotoEntity, PostCommentEntity };
