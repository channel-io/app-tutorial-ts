import "reflect-metadata";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./src/app.module.js";
import { rewriteAppStoreFunctionUrl } from "./src/function-endpoint.js";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });
  app.enableShutdownHooks();
  app.use(
    (
      request: { method: string; url: string },
      _response: unknown,
      next: () => void,
    ) => {
      request.url = rewriteAppStoreFunctionUrl(request.method, request.url);
      next();
    },
  );

  const wamDist = resolve(process.cwd(), "../wam/dist");
  if (existsSync(wamDist)) {
    app.useStaticAssets(wamDist, { prefix: "/resource/wam/tutorial" });
  } else {
    new Logger("Bootstrap").warn(
      `WAM build not found at ${wamDist}. Run pnpm build from the repository root.`,
    );
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  const logger = new Logger("Bootstrap");
  logger.log(`Server: http://localhost:${port}`);
  logger.log(`Function endpoint: http://localhost:${port}/functions`);
  logger.log(`WAM endpoint: http://localhost:${port}/resource/wam`);
}

void bootstrap();
