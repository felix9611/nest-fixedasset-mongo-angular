import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetType } from './assetType.schame'
import { AssetTypeCreateDto, AssetTypeListSearchDto, AssetTypeUpdateDto } from './assetType.dto'

@Injectable()
export class AssetTypeService {
    constructor(@InjectModel(AssetType.name) private assetTypeModel: Model<AssetType>) {}
    
    async create(createDto: AssetTypeUpdateDto) {

        const { _id, ..._createData } = createDto

        const checkData = await this.findCheckData(_createData.typeCode, _createData.typeName)
        

        if (checkData) {
            return {
                msg: 'This type already exist!'
            }
        } else {
            const finalData = {
                ..._createData,
                createdAt: new Date(),
                status: 1
            }
            const created = new this.assetTypeModel(finalData)
            return await created.save()
        }
    }

    async update(updateDto: AssetTypeUpdateDto) {
        const { _id, ..._updateDto } = updateDto

        const checkData = await this.assetTypeModel.findOne({ _id, status: 1 })

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
                msg: 'This asset type not exist!'
            }
            

        }
    }

    async getOneById(_id: string) {
        const data = await this.assetTypeModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This asset type has been invalidated! Please contact admin!'
            }
        }
    }

    async voidOne(_id: string) {
        const checkData = await this.assetTypeModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.assetTypeModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            })
        
            if (res.modifiedCount === 1) {
                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
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
                $or: [
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