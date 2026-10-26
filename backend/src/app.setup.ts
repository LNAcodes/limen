import { INestApplication, ValidationPipe } from '@nestjs/common';

// Shared setup for the real app and the integration tests.
// Both need the same validation and CORS rules, otherwise the tests would check a different app
export function configureApp(app: INestApplication): void {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Turns the raw request body into a DTO instance and URL params into the types declared in the controller
      transform: true,
      // Converts values based on their TypeScript type, e.g. "2" from the URL becomes the number 2
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors({ origin: process.env.FRONTEND_URL });
}
