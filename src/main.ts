import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: ["debug", "log", "error", "warn"],
    });

    app.setGlobalPrefix("/api/v1");
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors({
        allowedHeaders: "*",
        methods: "GET,POST,PUT,DELETE,OPTIONS",
        origin: "*",
    });

    await app.listen(process.env.PORT || 3500);
}
bootstrap();
