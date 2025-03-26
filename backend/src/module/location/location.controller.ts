import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { CreateLocationBody, CreateLocationDto, ListLocationQuery, ListLocationQueryRes, ListLocationRequestDto, LocationBody, UpdateLocationBody, UpdateLocationDto } from './location.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { LocationService } from './location.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from '../../tool/open-api-body'

@Controller('base/location')
export class LocationController {
    constructor(private locationService: LocationService){}

    @ApiOperation({ summary: 'Create Location' })
    @ApiBody({ type: CreateLocationBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateLocationDto) {
        return await this.locationService.create(createData)
    }

    @ApiOperation({ summary: 'Update Location' })
    @ApiBody({ type: UpdateLocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateDto: UpdateLocationDto) {
        return await this.locationService.update(updateDto)
    }

    @ApiOperation({ summary: 'Get one by ID' })
    @ApiResponse({ description: 'If successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If no data', status: 200, type: ReturnMsg })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string) {
        return await this.locationService.getOneById(id)
    }

    @ApiOperation({ summary: 'Void one by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('remove/:id')
    @UseGuards(AuthGuard)
    async removeById(@Param('id') id: string) {
        return await this.locationService.invalidate(id)
    }

    @ApiOperation({ summary: 'Get all Data' })
    @ApiResponse({ description: 'If successful', status: 201, type: [LocationBody] })
    @Get('getAll')
    @UseGuards(AuthGuard)
    async getAll() {
        return await this.locationService.findAll()
    }
    
    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListLocationQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: ListLocationQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() req: ListLocationRequestDto) {
        return await this.locationService.listPage(req)
    }

    @ApiOperation({ summary: 'batch-import' })
    @ApiBody({ type: [CreateLocationBody] })
    @ApiResponse({ description: 'If save successful', status: 201, type: LocationBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('batch-import')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: CreateLocationBody[]) {
        for (const createData of createDatas) {
            return await this.locationService.create(createData)
        }
    }
    
}