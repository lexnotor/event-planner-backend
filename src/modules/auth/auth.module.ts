import { Module } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SecretEntity, UserEntity } from "../user/user.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, SecretEntity]),
        JwtModule,
        ConfigModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtService, ConfigService],
    exports: [JwtService, ConfigService],
})
export class AuthModule {}
