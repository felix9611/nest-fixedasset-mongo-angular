import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { CreateUserRequestDto, CreateUserDto, ListUserRequestDto } from './sysUser.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('sys/user')
export class SysUserController {
    constructor(private readonly userService: SysUserService) {}

    @Post('create-user')
    @UseGuards(AuthGuard)
    async createUser(@Body() createUserRequest: CreateUserRequestDto) {
        return await this.userService.createUser(createUserRequest);
    }

    @Post('update-uesr/:id')
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateRequesr: CreateUserDto, @Param('id') id: string) {
        return await this.userService.updateUser(id, updateRequesr)
    }

    @Post('user-self/update-password')
    @UseGuards(AuthGuard)
    async updatePasswordByUserSelf(@Body() updatePw: { password: string }, @Req() req: any) {
        return await this.userService.updatePassword(req.user.username, updatePw.password)
    }

    @Post('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Body() updatePw: { password: string, username: string }) {
        return await this.userService.updatePassword(updatePw.username, updatePw.password)
    }

    @Delete('invalidate-user/:id')
    @UseGuards(AuthGuard)
    async invalidateUser(@Param('id') id: string) {
        return await this.userService.invalidateUser(id)
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getUserInfoById(@Param('id') id: string) {
        return await this.userService.getUserInfo(id)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listPage(@Body() requestBody: ListUserRequestDto) {
        return await this.userService.listUser(requestBody)
    }

}