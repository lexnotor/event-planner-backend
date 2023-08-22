import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MinLength,
} from "class-validator";

export enum gigType {
    LAUNCH = "LAUNCH",
    MC = "MC",
    DECORATION = "DECORATION",
    SONORISATION = "SONORISATION",
    ROOM = "ROOM",
    ORGANISATEUR = "ORGANISATEUR",
    TRANSPORT = "TRANSPORT",
    IMPRIMERIE = "IMPRIMERIE",
    LOCATION = "LOCATION",
    HABILLEMENT = "HABILLEMENT",
}

class CreateGigDto {
    @IsEnum(gigType)
    @IsNotEmpty()
    type: gigType;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    text?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    tags?: string;
}

class UpdateGigDto {
    @IsEnum(gigType)
    @IsOptional()
    type: gigType;

    @IsString()
    @IsOptional()
    @MinLength(3)
    title: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    text?: string;

    @IsOptional()
    @IsString()
    @MinLength(3)
    tags?: string;
}

class FindGigQueryDto {
    @IsOptional()
    @IsUUID()
    id?: string;

    @IsOptional()
    @IsString()
    text?: string;
}

export { CreateGigDto, FindGigQueryDto, UpdateGigDto };
