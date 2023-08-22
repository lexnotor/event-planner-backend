import { Module } from "@nestjs/common";
import { GigController } from "./gig.controller";
import { GigService } from "./gig.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GigEntity } from "./gig.entity";
import { UserModule } from "../user/user.module";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [TypeOrmModule.forFeature([GigEntity]), UserModule, AuthModule],
    controllers: [GigController],
    providers: [GigService],
    exports: [GigService],
})
export class GigModule {}
