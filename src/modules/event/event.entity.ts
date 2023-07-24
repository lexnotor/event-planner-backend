import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, JoinColumn, ManyToMany, Relation } from "typeorm";
import { PhotoEntity } from "../photo/photo.entity";

@Entity("event")
class EventEntity extends DefaultEntity {
    @Column()
    public: boolean;

    @Column()
    price: string;

    // budget - lieu - prix
    @Column({ type: "jsonb" })
    data: object;

    @Column()
    text: string;

    @Column()
    comments: string;

    @Column()
    likes: number;

    @Column()
    tags: string;

    @Column()
    type: string;

    @Column()
    location: string;
}

@Entity("event_photo")
class EventPhotoEntity extends DefaultEntity {
    @ManyToMany(() => EventEntity)
    @JoinColumn({ name: "event_id" })
    event: Relation<EventEntity>;

    @ManyToMany(() => PhotoEntity)
    @JoinColumn({ name: "photo_id" })
    photo: Relation<PhotoEntity>;
}

export { EventEntity, EventPhotoEntity };
