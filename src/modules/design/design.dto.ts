import {
    IsBoolean,
    IsDate,
    IsJSON,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";

class CreateDesignDto {
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
class UpdateDesignDto {
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
class AddCommentDesignDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    text: string;

    @IsOptional()
    @IsDate()
    date: Date;
}

export { CreateDesignDto, UpdateDesignDto, AddCommentDesignDto };
