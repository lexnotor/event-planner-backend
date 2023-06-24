import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class AppService {
    private count = 0;

    getHello(): string {
        return "Hello World!";
    }

    log(payload: any) {
        Logger.log(++this.count + payload, "CRON");
    }
}
