import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { SysRoleService } from './role.service';
import { CreateSysRoleDto, ListRoleRequestDto, UpdateSysRoleDto } from './role.dto';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('sys/role')
export class SysRoleController {
    constructor(private sysRoleService: SysRoleService){}

    @Post('create')
    async create(@Body() createData: CreateSysRoleDto) {
        return await this.sysRoleService.create(createData)
    }

    @Post('update')
    async update(@Body() updateDto: UpdateSysRoleDto) {
        return await this.sysRoleService.update(updateDto)
    }

    @Get('one/:id')
    async getOneById(@Param('id') id: string) {
        return await this.sysRoleService.getOneById(id)
    }

    @Delete('delete/:id')
    async removeById(@Param('id') id: string) {
        return await this.sysRoleService.invalidateRole(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.sysRoleService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListRoleRequestDto) {
        return this.sysRoleService.listPageRole(req)
    }
    
}