import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length,
} from "class-validator";

enum UserTypes {
    PRESTATAIRE = "PRESTATAIRE",
    USER = "USER",
    COMMUNITY = "COMMUNITY",
}
class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    firstname: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 50)
    lastname: string;

    // @IsNotEmpty()
    // @IsString()
    // @Length(3, 30)
    // username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    description = "";

    @IsOptional()
    @IsString()
    @IsEnum(UserTypes)
    types: string = UserTypes.USER;
}

export { UserTypes, CreateUserDto };
