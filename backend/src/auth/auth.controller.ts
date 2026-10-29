import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import type { Request } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard.js';
import { LoginDto } from './dto/login.dto.js';
import type { AuthenticatedUser, SafeUser } from '../users/types/user.types.js';
import { Public } from './decorators/public.decorator.js';
import { UsersService } from '../users/users.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiCreatedResponse({ description: 'The account was created' })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in and receive a JWT' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Returns an access token' })
  login(@Req() request: Request & { user: SafeUser }) {
    return this.authService.issueAccessToken(request.user);
  }

  // GET /auth/me: no @Public(), so the global JwtAuthGuard checks the token first.
  // If the token is valid, the JwtStrategy puts { userId, role } into request.user.
  // Then this method runs and loads the full user from the database.
  @Get('me')
  @ApiOperation({ summary: 'Get the logged-in user' })
  getCurrentUser(@Req() request: Request & { user: AuthenticatedUser }) {
    return this.usersService.findUserById(request.user.userId);
  }

  // The logged-in user deletes their own account.
  // 204 No Content: success, but nothing to send back.
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMe(@CurrentUser() currentUser: AuthenticatedUser): Promise<void> {
    return this.usersService.removeUser(currentUser.userId);
  }
}
