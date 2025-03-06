
import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Req } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './AuthGuard'
import { SysUserService } from '../sys-user/sysUser.service'
import { PublicRoute } from 'src/tool/public-route.decorator'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: SysUserService) {}

  @HttpCode(HttpStatus.OK)
  @PublicRoute()
  @Post('login')
  async signIn(@Body() signInDto: any) {
    return await this.authService.signIn(signInDto.username, signInDto.password)
  }

  @Get('verify-token')
  @UseGuards(AuthGuard)
  async verfiyToken(@Req() req: any) {
    return await this.authService.verifyToken(req.headers.authorization)
  }

  @Get('user-profile')
  @UseGuards(AuthGuard)
  async getUserProfile(@Req() req: any) {
    return await this.userService.findOneUser(req.user.username)
  }
}