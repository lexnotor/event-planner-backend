import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, JoinColumn, ManyToOne, Relation } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("gigs")
class GigEntity extends DefaultEntity {
    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    text: string;

    @Column()
    tags: string;

    @Column()
    likes: number;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: "user_id" })
    user: Relation<UserEntity>;
}

export { GigEntity };
