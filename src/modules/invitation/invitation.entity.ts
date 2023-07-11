import { DefaultEntity } from "@/utils/entity";
import { Column, Entity, ManyToOne, Relation } from "typeorm";
import { UserEntity } from "../user/user.entity";

@Entity("invitation")
class InvitationEntity extends DefaultEntity {
    @Column()
    public: boolean;

    @Column()
    price: string;

    @Column()
    data: string;

    @Column()
    text: string;

    @Column()
    comments: string;

    @Column()
    likes: number;

    @Column()
    tags: string;

    @ManyToOne(() => UserEntity, (user) => user.invitations)
    user: Relation<UserEntity>;
}

export { InvitationEntity };
