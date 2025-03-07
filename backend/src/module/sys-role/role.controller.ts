import { Body, Controller, Post } from '@nestjs/common'
import { SysRoleService } from './role.service';
import { CreateSysRoleDto } from './role.dto';

@Controller('sys/role')
export class SysRoleController {
    constructor(private sysRoleService: SysRoleService){}

    @Post('create')
    async create(@Body() createData: CreateSysRoleDto) {
        return await this.sysRoleService.create(createData)
    }
}