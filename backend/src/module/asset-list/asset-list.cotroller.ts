import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AssetListService } from './asset-list.service'
import { AuthGuard } from '../auth/AuthGuard'
import { DashboardReqDto, ListAssetReqDto, UpdateAssetDto } from './asset-list.dto'
import { AssetListQueryService } from './asset-list-guery.service'

@Controller('asset/asset-list')
export class AssetListController {

    constructor(
        private assetListService: AssetListService,
        private assetListQueryService: AssetListQueryService
    ) {}

    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: string) {
        return await this.assetListService.getById(id)
    }

    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getByAssetCode(@Param('code') code: string) {
        return await this.assetListService.getByAssetCode(code)
    }

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateAssetDto, @Req() req: any) {
        return await this.assetListService.create(createData, req.user.username)
    }

    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateData: UpdateAssetDto) {
        return await this.assetListService.update(updateData)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() query: ListAssetReqDto) {
        return await this.assetListService.listPage(query)
    }

    @Get('list-all')
    @UseGuards(AuthGuard)
    async listAndPageGet() {
        return await this.assetListService.listAllAsset()
    }

    @Get('file-remove/:id')
    @UseGuards(AuthGuard)
    async removeFile(@Param('id') id: string) {
        return await this.assetListService.voidFileById(id)
    }

    @Get('load-file/:id')
    @UseGuards(AuthGuard)
    async loadFile(@Param('id') id: string) {
        return await this.assetListService.loadFileByAssetId(id)
    }

    @Post('chart-query')
    @UseGuards(AuthGuard)
    async chatQuery(@Body() query: DashboardReqDto) {
        return await this.assetListQueryService.queryMakerForDateAndData(query)
    }
}
