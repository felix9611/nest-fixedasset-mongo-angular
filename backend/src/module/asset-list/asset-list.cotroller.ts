import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AssetListService } from './asset-list.service'
import { AuthGuard } from '../auth/AuthGuard'
import { AssetListBody, AssetListFileBody, AssetListFullBody, AssetListListQueryRes, AssetListQuery, CreateAssetBody, DashboardReqBody, DashboardReqDto, ListAssetReqDto, UpdateAssetBody, UpdateAssetDto, UploadAssetListDto } from './asset-list.dto'
import { AssetListQueryService } from './asset-list-query.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('asset/asset-list')
export class AssetListController {

    constructor(
        private assetListService: AssetListService,
        private assetListQueryService: AssetListQueryService
    ) {}

    @ApiOperation({ summary: 'Get by id' })
    @ApiResponse({ description: 'If save successful', status: 201, type: AssetListBody })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getById(@Param('id') id: string) {
        return await this.assetListService.getById(id)
    }

    @ApiOperation({ summary: 'Get by asset code' })
    @ApiResponse({ description: 'If save successful', status: 201, type: AssetListBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: AssetListBody })
    @Get('code/:code')
    @UseGuards(AuthGuard)
    async getByAssetCode(@Param('code') code: string) {
        return await this.assetListService.getByAssetCode(code)
    }

    @ApiOperation({ summary: 'Create Asset List' })
    @ApiBody({ type: UpdateAssetBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: AssetListBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: AssetListBody })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateAssetDto, @Req() req: any) {
        return await this.assetListService.create(createData, req.user.username)
    }

    @ApiOperation({ summary: 'Update Asset List' })
    @ApiBody({ type: UpdateAssetBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateData: UpdateAssetDto) {
        return await this.assetListService.update(updateData)
    }

    @ApiOperation({ summary: 'List and page' })
    @ApiBody({ type: AssetListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: AssetListListQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() query: ListAssetReqDto) {
        return await this.assetListService.listPage(query)
    }

    @ApiOperation({ summary: 'List all' })
    @ApiResponse({ description: 'If successful', status: 201, type: AssetListFullBody, isArray: true })
    @Get('list-all')
    @UseGuards(AuthGuard)
    async listAndPageGet() {
        return await this.assetListService.listAllAsset()
    }

    @ApiOperation({ summary: 'Void one file by ID' })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Get('file-remove/:id')
    @UseGuards(AuthGuard)
    async removeFile(@Param('id') id: string) {
        return await this.assetListService.voidFileById(id)
    }

    @ApiOperation({ summary: 'Load files by asset ID' })
    @ApiResponse({ description: 'If successful', status: 201, type: AssetListFileBody, isArray: true })
    @Get('load-file/:id')
    @UseGuards(AuthGuard)
    async loadFile(@Param('id') id: string) {
        return await this.assetListService.loadFileByAssetId(id)
    }

    @ApiOperation({ summary: 'Chart by data type' })
    @ApiBody({ type: DashboardReqBody })
    @Post('chart-query-data')
    @UseGuards(AuthGuard)
    async chatQueryDate(@Body() query: DashboardReqDto) {
        return await this.assetListQueryService.queryMakerForData(query)
    }

    @ApiOperation({ summary: 'Chart by date and data' })
    @ApiBody({ type: DashboardReqBody })
    @Post('chart-query-date')
    @UseGuards(AuthGuard)
    async chatQueryData(@Body() query: DashboardReqDto) {
        return await this.assetListQueryService.queryMakerForDateAndData(query)
    }

    @ApiOperation({ summary: 'Batch to Create Asset List' })
    @ApiBody({ type: CreateAssetBody, isArray: true })
    @ApiResponse({ description: 'If save successful', status: 201, type: AssetListBody, isArray: true })
    @Post('batch-create')
    @UseGuards(AuthGuard)
    async importData(@Body() createDatas: UploadAssetListDto[]) {
        return await this.assetListService.importData(createDatas)
    }
}
