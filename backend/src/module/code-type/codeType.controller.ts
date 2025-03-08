import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CreateCodeTypeDto, ListCodeTypeRequestDto, UpdateCodeTypeDto } from './codeType.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { CodeTypeService } from './codeType.service'

@Controller('base/code-type')
export class CodeTypeController {
    constructor(private codeTypeService: CodeTypeService){}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateCodeTypeDto) {
        return await this.codeTypeService.create(createData)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateCodeTypeDto) {
        return await this.codeTypeService.update(updateDto)
    }

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.codeTypeService.getOneById(id)
    }

    @Delete('delete/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.codeTypeService.invalidateDepartment(id)
    }

    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return this.codeTypeService.findAll()
    }
    
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListCodeTypeRequestDto) {
        return this.codeTypeService.listPageRole(req)
    }
    
}