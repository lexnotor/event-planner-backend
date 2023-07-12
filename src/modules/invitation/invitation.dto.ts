import {
    IsBoolean,
    IsJSON,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";

class CreateInvitationDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    text: string;

    @IsString()
    @IsOptional()
    price = "free";

    @IsBoolean()
    @IsOptional()
    public = true;

    @IsString()
    @IsOptional()
    tags = "";

    @IsJSON()
    @IsString()
    @IsOptional()
    data = "{}";
}
class UpdateInvitationDto {
    @IsString()
    @MinLength(3)
    @IsOptional()
    text: string;

    @IsString()
    @IsOptional()
    price: string;

    @IsBoolean()
    @IsOptional()
    public: boolean;

    @IsString()
    @IsOptional()
    tags: string;

    @IsJSON()
    @IsString()
    @IsOptional()
    data: string;
}

export { CreateInvitationDto, UpdateInvitationDto };