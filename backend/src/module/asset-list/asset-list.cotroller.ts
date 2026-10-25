import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AssetListService } from './asset-list.service'
import { AuthGuard } from '../auth/AuthGuard'
import { AssetListBody, AssetListFileBody, AssetListFullBody, AssetListListQueryRes, AssetListQuery, CreateAssetBody, DashboardReqBody, DashboardReqDto, ListAssetReqDto, UpdateAssetBody, UpdateAssetDto, UploadAssetListDto } from './asset-list.dto'
import { AssetListQueryService } from './asset-list-query.service'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

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
    async getByAssetCode(@Param('code') code: string, @Req() { user }: { user: JwtPayload }) {
        const data = await this.assetListService.getByAssetCode(code)
        return data
    }

    @ApiOperation({ summary: 'Create Asset List' })
    @ApiBody({ type: UpdateAssetBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: AssetListBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: AssetListBody })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: UpdateAssetDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === false) {
            if (!user.departmentIds.includes(createData.deptId)) {
               throw new HttpException({ message: 'Department access denied' }, HttpStatus.FORBIDDEN)
            } else if (!user.departmentIds.includes(createData.placeId)) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.assetListService.create(createData, user.username)
            }
        } else {
            return await this.assetListService.create(createData, user.username)
        }
    }

    @ApiOperation({ summary: 'Update Asset List' })
    @ApiBody({ type: UpdateAssetBody })
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() updateData: UpdateAssetDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === false) {
            if (!user.departmentIds.includes(updateData.deptId)) {
               throw new HttpException({ message: 'Department access denied' }, HttpStatus.FORBIDDEN)
            } else if (!user.departmentIds.includes(updateData.placeId)) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.assetListService.update(updateData)
            }
        } else {
            return await this.assetListService.update(updateData)
        }
    }

    @ApiOperation({ summary: 'List with query' })
    @ApiBody({ type: AssetListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: [AssetListFullBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithQuery(@Body() query: ListAssetReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.assetListService.listWithFilter(query)
        } else {
            if ((query.deptIds ?? []).some(deptId => !user.departmentIds.includes(deptId))) {
                throw new HttpException({ message: 'Department access denied' }, HttpStatus.FORBIDDEN)
            } else if ((query.placeIds ?? []).some(placeId => !user.placeIds.includes(placeId))) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.assetListService.listWithFilter(query)
            }
        }
    }

    @ApiOperation({ summary: 'List and page' })
    @ApiBody({ type: AssetListQuery })
    @ApiResponse({ description: 'If successful', status: 201, type: AssetListListQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async listAndPage(@Body() query: ListAssetReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.assetListService.listPage(query)
        } else {
            if ((query.deptIds ?? []).some(deptId => !user.departmentIds.includes(deptId))) {
                throw new HttpException({ message: 'Department access denied' }, HttpStatus.FORBIDDEN)
            } else if ((query.placeIds ?? []).some(placeId => !user.placeIds.includes(placeId))) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.assetListService.listPage(query) 
            }
        }
    }

    @ApiOperation({ summary: 'List all' })
    @ApiResponse({ description: 'If successful', status: 201, type: AssetListFullBody, isArray: true })
    @Get('list-all')
    @UseGuards(AuthGuard)
    async listAndPageGet(@Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.assetListService.listAllAsset()
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
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
    async importData(@Body() createDatas: UploadAssetListDto[], @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.assetListService.importData(createDatas)
        } else {
            throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }
}
