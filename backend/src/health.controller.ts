import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('health')
export class HealthController {
  /** Usado por el hosting (Render) para saber si la API está viva. */
  @Get()
  check() {
    return { status: 'ok' };
  }
}
