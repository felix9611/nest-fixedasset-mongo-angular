
import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './AuthGuard'
import { SysUserService } from '../sys-user/sysUser.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: SysUserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: any) {
    return this.authService.signIn(signInDto.username, signInDto.password)
  }

  @Get('user-profile')
  // @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: any) {
    return await this.userService.findOneUser(req.user.username)
  }
}