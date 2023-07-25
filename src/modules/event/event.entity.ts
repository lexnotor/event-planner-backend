import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { PhotoEntity } from "../photo/photo.entity";
import { UserEntity } from "../user/user.entity";

@Entity("event")
class EventEntity extends DefaultEntity {
    @Column({ default: true })
    public: boolean;

    @Column({ nullable: true })
    price: string;

    // budget - lieu - prix
    @Column({ type: "jsonb" })
    data: object;

    @Column({ nullable: true })
    text: string;

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

    @Column({ nullable: true })
    location: string;

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

export { EventEntity, EventPhotoEntity };
