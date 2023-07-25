import {
    IsBoolean,
    IsEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";

class CreateEventDto {
    @IsOptional()
    @IsBoolean()
    public?: boolean;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    data?: object;

    @IsOptional()
    @IsString()
    text?: string;

    @IsEmpty()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    comments?: string;

    @IsOptional()
    @IsString()
    likes?: number;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    location?: string;
}
class UpdateEventDto {
    @IsOptional()
    @IsBoolean()
    public?: boolean;

    @IsOptional()
    @IsString()
    price?: string;

    @IsOptional()
    @IsString()
    data?: object;

    @IsOptional()
    @IsString()
    text?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    title?: string;

    @IsOptional()
    @IsString()
    comments?: string;

    @IsOptional()
    @IsString()
    likes?: number;

    @IsOptional()
    @IsString()
    tags?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    location?: string;
}

export { CreateEventDto, UpdateEventDto };
