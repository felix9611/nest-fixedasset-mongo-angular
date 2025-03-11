import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AssetListService } from './asset-list.service'
import { AuthGuard } from '../auth/AuthGuard'
import { create } from 'domain'
import { CreateAssetDto } from './asset-list.dto'

@Controller('asset/asset-list')
export class AssetListController {

    constructor(private assetListService: AssetListService) {}

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: string) {
        return await this.assetListService.getById(id)
    }

    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getByAssetCode(@Param('code') code: string) {
        return await this.assetListService.getById(code)
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateAssetDto) {
        return await this.assetListService.create(createData)
    }
}