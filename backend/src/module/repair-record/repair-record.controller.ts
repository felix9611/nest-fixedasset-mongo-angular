import { Body, Controller, Param, Post, UseGuards, Get } from '@nestjs/common'
import { RepairRecordService } from './repair-record.service'
import { CreateRepairRecordDto, UpdateRepairRecordDto, ListRepairRecordDto, CreateRepairRecordBody, RepairRecordBody, ListRepairRecordQuery, ListRepairRecordQueryRes, UpdateRepairRecordBody, UploadRepairRecordBody } from './repair-record.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('aaset/repair-record')
export class RepairRecordController {
    constructor(private repairRecordService: RepairRecordService) {}

    @ApiOperation({ summary: 'Create Repair Record' })
    @ApiBody({ type: CreateRepairRecordBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: RepairRecordBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateRepairRecordDto) {
        return await this.repairRecordService.create(createData)
    }

     @ApiOperation({ summary: 'Update Department' })
        @ApiBody({ type: UpdateRepairRecordBody })
        @ApiResponse({ description: 'If not save successful',status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateData: UpdateRepairRecordDto) {
        return await this.repairRecordService.update(updateData)
    }

    @ApiOperation({ summary: 'Get One by Id' })
    @ApiResponse({ status: 201, type: RepairRecordBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.repairRecordService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void One by Id' })
    @ApiResponse({  description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('void/:id')
    @UseGuards(AuthGuard)
    async voidOneById(@Param('id') id: string) {
        return await this.repairRecordService.invalidate(id)
    }

    
    @ApiOperation({ summary: 'Lsit and page' })
    @ApiBody({ type: ListRepairRecordQuery })
    @ApiResponse({ status: 200,  type: ListRepairRecordQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() query: ListRepairRecordDto) {
        return await this.repairRecordService.listAndPage(query)
    }

    @ApiOperation({ summary: 'Batch Create' })
    @ApiBody({ type: [UploadRepairRecordBody] })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UploadRepairRecordBody[]) {
        return await this.repairRecordService.importData(createDatas)
    }
}