import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { DepartmentService } from './department.service';
import { CreateDeptDto, ListDeptRequestDto, UpdateDeptDto } from './department.dto';
import { AuthGuard } from '../auth/AuthGuard';

@Controller('sys/department')
export class DepartmentController {
    constructor(private deptService: DepartmentService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateDeptDto) {
        return await this.deptService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateDeptDto) {
        return await this.deptService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.deptService.getOneById(id)
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.deptService.invalidateDepartment(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.deptService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListDeptRequestDto) {
        return this.deptService.listPageRole(req)
    }
    
}