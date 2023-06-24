import { All, Controller, Get, Logger } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @All()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("cron")
    getCron() {
        this.appService.log(`Cron at ${new Date().toLocaleString()}`);
        return {
            server: "Alivep",
        };
    }
}
