import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { CommentEntity } from "../comment/comment.entity";
import { GigEntity } from "../gig/gig.entity";
import { PhotoEntity } from "../photo/photo.entity";
import { UserEntity } from "../user/user.entity";

@Entity("event")
class EventEntity extends DefaultEntity {
    @Column({ default: true })
    public: boolean;

    @Column({ nullable: true })
    price: string;

    // budget - lieu - prix
    @Column({ type: "jsonb", nullable: true })
    data: object;

    @Column({ nullable: true })
    text: string;

    @Column({ nullable: true })
    location: string;

    @Column("timestamp", { nullable: true })
    date: Date;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: true })
    comments: string;

    @Column({ nullable: true })
    likes: number;

    @Column({ nullable: true })
    tags: string;

    @Column({ nullable: true })
    type: string;

    @ManyToOne(() => UserEntity)
    user: Relation<UserEntity>;
}

@Entity("event_photo")
class EventPhotoEntity extends DefaultEntity {
    @ManyToOne(() => EventEntity)
    @JoinColumn({ name: "event_id" })
    event: Relation<EventEntity>;

    @ManyToOne(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

@Entity("event_photo")
class EventCommentEntity extends DefaultEntity {
    @ManyToOne(() => EventEntity)
    @JoinColumn({ name: "event_id" })
    event: Relation<EventEntity>;

    @ManyToOne(() => CommentEntity)
    @JoinColumn({ name: "comment_id" })
    comment: Relation<CommentEntity>;
}

@Entity("event_gig")
class EventGigEntity extends DefaultEntity {
    @Column()
    title: string;

    @Column()
    details: string;

    @Column({ default: false })
    confirm: boolean;

    @ManyToOne(() => EventEntity, { nullable: false })
    @JoinColumn({ name: "event_id" })
    event: Relation<EventEntity>;

    @ManyToOne(() => GigEntity, { nullable: true })
    @JoinColumn({ name: "gig_id" })
    gig: Relation<GigEntity>;
}

export { EventCommentEntity, EventEntity, EventGigEntity, EventPhotoEntity };
