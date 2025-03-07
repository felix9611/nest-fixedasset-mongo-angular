import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetType } from './assetType.schame'
import { AssetTypeCreateDto, AssetTypeListSearchDto, AssetTypeUpdateDto } from './assetType.dto'

@Injectable()
export class AssetTypeService {
    constructor(@InjectModel(AssetType.name) private assetTypeModel: Model<AssetType>) {}
    
    async create(createDto: AssetTypeCreateDto) {

        const checkData = await this.findCheckData(createDto.typeCode, createDto.typeName)

        if (checkData) {
            return {
                msg: 'This type already exist!'
            }
        } else {
            const finalData = {
                ...createDto,
                createdAt: new Date(),
                status: 1
            }
            const created = new this.assetTypeModel(finalData)
            return await created.save()
        }
    }

    async update(updateDto: AssetTypeUpdateDto) {
        const { _id, ..._updateDto } = updateDto

        const checkData = await this.findCheckData(_updateDto.typeCode, _updateDto.typeName)

        if (checkData) {
            const finalData = {
                ..._updateDto,
                updatedAt: new Date()
            }

            return await this.assetTypeModel.updateOne(
                { _id }, 
                finalData
            )
        } else {
            return {
                msg: 'This type already exist!'
            }
            

        }
    }


    async findCheckData(typeCode: string, typeName: string) {
        return await this.assetTypeModel.findOne({
            typeCode: typeCode,
            typeName: typeName
        })
    }

    async findAll(): Promise<AssetType[]> {
        return this.assetTypeModel.find({
            status: 1
        }).exec();
    }

    async listAssetTypeBySearch(req: AssetTypeListSearchDto) {
        const { name, page, limit } = req
        const skip = (page - 1) * limit

        const filters = {
            ...name? {
                Or: [
                    {
                        typeCode: { $regex: name, $options: 'i' }
                    },
                    {
                        typeName: { $regex: name, $options: 'i' }
                    }
                ]
            } : {},
            status: 1
        }

        const lists: AssetType[] = await this.assetTypeModel
            .find(filters)
            .skip(skip)
            .limit(limit)
            .exec()
        const total = await this.assetTypeModel.find(filters).countDocuments()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists
        }

    }
}