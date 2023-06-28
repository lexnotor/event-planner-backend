import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsUrl,
    Length,
} from "class-validator";

enum UserTypes {
    PRESTATAIRE = "PRESTATAIRE",
    USER = "USER",
    COMMUNITY = "COMMUNITY",
}

enum SocialTypes {
    LINKEDIN = "LINKEDIN",
    FACEBOOK = "FACEBOOK",
    WHATSAPP = "WHATSAPP",
    TWITTER = "TWITTER",
    YOUTUBE = "YOUTUBE",
    INSTAGRAM = "INSTAGRAM",
}

enum ContactTypes {
    PHONE = "PHONE",
    EMAIL = "EMAIL",
}

class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(3, 50)
    firstname: string;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    lastname: string;

    @IsOptional()
    @IsString()
    @Length(3, 30)
    username: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    description: string;

    @IsOptional()
    @IsString()
    @IsEnum(UserTypes)
    types: UserTypes;
}

class SearchUserDto {
    @IsOptional()
    @IsString()
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    firstname: string;

    @IsOptional()
    @IsString()
    @Length(3, 50)
    lastname: string;

    @IsOptional()
    @IsString()
    @Length(3, 30)
    username: string;

    @IsOptional()
    @IsString()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Length(0, 200)
    description: string;

    @IsOptional()
    @IsString()
    @IsEnum(UserTypes)
    types: UserTypes;
}

class AddSocialDto {
    @IsNotEmpty()
    @IsUrl()
    link: string;

    @IsNotEmpty()
    @IsEnum(SocialTypes)
    type: SocialTypes;
}
class AddContactDto {
    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    content: string;

    @IsNotEmpty()
    @IsEnum(ContactTypes)
    type: ContactTypes;
}

export {
    AddSocialDto,
    SearchUserDto,
    SocialTypes,
    UpdateUserDto,
    UserTypes,
    ContactTypes,
    AddContactDto,
};
