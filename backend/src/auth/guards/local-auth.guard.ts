import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard for the login route: runs the LocalStrategy ("local") before the controller.
// Strategy = how to check, Guard = where to checks
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
