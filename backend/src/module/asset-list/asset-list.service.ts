import { Injectable } from '@nestjs/common'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetList } from './asset-list.schame'
import { AssetListFileDto, CreateAssetDto, ListAssetReqDto, UpdateAssetDto, UploadAssetListDto } from './asset-list.dto'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { AssetListFile } from './asset-list-file.schame'
import { TaxInformation } from '../tax-information/tax-information.schame'
import { Department } from '../department/department.schame'
import { AssetType } from '../asset-type/assetType.schame'
import { Location } from '../location/location.schame'
import { AssetTypeService } from '../asset-type/assetType.service'
import { TaxInformationService } from '../tax-information/tax-information.service'
import { DepartmentService } from '../department/department.service'
import { LocationService } from '../location/location.service'


@Injectable()
export class AssetListService {
    constructor(
        @InjectModel(AssetList.name) private assetListModel: Model<AssetList>,
        @InjectModel(AssetListFile.name) private assetListFileModel: Model<AssetListFile>,
        @InjectModel(TaxInformation.name) private taxInfoModel: Model<TaxInformation>,
        @InjectModel(Department.name) private departmentModel: Model<Department>,
        @InjectModel(Location.name) private locationModel: Model<Location>,
        @InjectModel(AssetType.name) private assetTypeModel: Model<AssetType>,
        private taxInfoSerivce: TaxInformationService,
        private assetTypeService: AssetTypeService,
        private departmentService: DepartmentService,
        private locationService: LocationService,
        private actionRecordService: ActionRecordService,
        private invRecordService: InvRecordService
    ) {}

    async getById(_id: string) {
        const res: any = await this.assetListModel.findOne({ _id }).exec()
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            res.assetListFiles = await this.getListFiles(_id)

            return res
        }
    }

    async getByAssetCode(assetCode: string) {
        const res = await this.assetListModel.findOne({ assetCode }).exec()
        if (res?.status === 0) {
            return {
                msg: 'This asset maybe voided! Please contact admin!'
            }
        } else {
            return res
        }
    }

    async create(data: UpdateAssetDto, username?: string) {
        const {  assetName, _id, assetCode, ..._data  } = data

        const check = await this.assetListModel.findOne({ assetName, status: 1})

        if (check) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: data,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This asset name already exist! Please check again!'
            }
        } else {
            const assetCodeNew = await this.createNewAssetCode()

            const finalData = {
                assetCode: assetCodeNew,
                assetName,
                ..._data,
                staffName: username,
                status: 1,
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset List',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            await this.invRecordService.create({
                assetCode: assetCodeNew,
                placeFrom: '',
                placeTo: _data.placeId
            })

            const create = new this.assetListModel(finalData)
            const res = await create.save()

            if (res) {

                if (_data.uploadAssetListFiles && _data.uploadAssetListFiles.length > 0) {
                    await this.uploadFile(_data.uploadAssetListFiles, res._id.toString())
                }

                return res
            } else {
                return {
                    msg: 'Oooops! Something wrong, please try again!'
                }
            }
        }
    }


    async update(data: UpdateAssetDto) {
        const { _id, ..._data } = data

        const check = await this.assetListModel.findOne({ _id, status: 1})

        if (check?.status === 1) {

            const finalData = {
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            if (check.placeId.toString() !== _data.placeId) {
                await this.invRecordService.create({
                    assetCode: _data.assetCode,
                    placeFrom: check.placeId.toString(),
                    placeTo: _data.placeId
                })
            }

            const res = await this.assetListModel.updateOne({ _id}, finalData).exec()
            if (res) {

                if (_data.uploadAssetListFiles && _data.uploadAssetListFiles.length > 0) {
                    await this.uploadFile(_data.uploadAssetListFiles, _id)
                }


                return res
            } else {
                return {
                    msg: 'Oooops! Something wrong, please try again!'
                }
            }

        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Asset',
                actionMethod: 'POST',
                actionFrom: 'Asset',
                actionData: data,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget may be invalidated or not exist! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.assetListModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Asset',
                actionMethod: 'GET',
                actionFrom: 'Asset',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget has been invalidated! Please contact admin!'
            }
        } else {
            await this.assetListModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
    
            await this.actionRecordService.saveRecord({
                actionName: 'Void Asset',
                actionMethod: 'GET',
                actionFrom: 'Asset',
                actionData: {
                    _id,
                    status: 0,
                    updateAt: new Date()
                },
                actionSuccess: 'Success',
                createdAt: new Date()
            })

            return {
              msg: 'Invalidate successfully!'
            }
        }
    }

    async listPage(request: ListAssetReqDto) {

        const { page, limit, assetCode, assetName, typeIds, placeIds, deptIds, purchaseDates } = request

        const skip = (page - 1) * limit

        const filters = {
            status: 1,
            ... purchaseDates && purchaseDates.length > 0 ? { purchaseDate: { $gte: new Date(purchaseDates[0]), $lte: new Date(purchaseDates[1]) }} : {},
            ...assetCode ? { assetCode } : {},
            ...assetName?  { assetName: { $regex: assetName, $options: 'i' } } : {},
            ...typeIds && typeIds?.length > 0 ? { typeId: { $in: typeIds} } : {},
            ...placeIds && placeIds?.length > 0 ? { placeId: { $in: placeIds} } : {},
            ...deptIds && deptIds?.length > 0 ? { deptId: { $in: deptIds} } : {}
        }

        const lists = await await this.assetListModel.aggregate([
            {
                $match: filters
            },
            {
                $lookup: {
                  from: 'locations', // Ensure correct collection name
                  let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                  as: 'location'
                }
            },
            {
                $lookup: {
                    from: 'departments', // Ensure correct collection name
                    let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                    as: 'department'
                }
            },
            {
                $lookup: {
                    from: 'assettypes', // Ensure correct collection name
                    let: { typeIdStr: { $toObjectId: '$typeId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                    as: 'assettype'
                }
            },
            { 
                $addFields: { 
                    assetCodeInt: { $toInt: "$assetCode" } 
                } 
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assettype', preserveNullAndEmptyArrays: true } },
            { $skip: skip },
            { $limit: limit },
            { $sort: { assetCodeInt: 1 } } 
        ]).exec()

        const total = await this.assetListModel.find(filters).countDocuments().exec()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async listAllAsset() {
        return  await await this.assetListModel.aggregate([
            {
                $lookup: {
                  from: 'locations', // Ensure correct collection name
                  let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                  pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                  as: 'location'
                }
            },
            {
                $lookup: {
                    from: 'departments', // Ensure correct collection name
                    let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                    as: 'department'
                }
            },
            {
                $lookup: {
                    from: 'assettypes', // Ensure correct collection name
                    let: { typeIdStr: { $toObjectId: '$typeId' } }, // Convert deptId to ObjectId
                    pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                    as: 'assettype'
                }
            },
            { $unwind: { path: '$location', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$department', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$assettype', preserveNullAndEmptyArrays: true } },
            { 
                $addFields: { 
                    assetCodeInt: { $toInt: "$assetCode" } 
                } 
            },
            { $sort: { assetCodeInt: 1 } } 
        ]).exec()
    }

    /// gen asset code

    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewAssetCode() {
        const result = await this.assetListModel.aggregate([
            {
              $addFields: { assetCodeInt: { $toInt: "$assetCode" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$assetCodeInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 6)
        } else {
            return this.formatNumber(maxNumber, 6)
        }
    }


    async uploadFile(updateFiles: AssetListFileDto[], assetId: string) {
        const itemsData = updateFiles.map((item) => ({
            ...item,
            assetId,
            status: 1,
            createdAt: new Date()
        }))

        await this.actionRecordService.saveRecord({
            actionName: 'Upload Asset Files',
            actionMethod: 'POST',
            actionFrom: 'Asset(Files)',
            actionData: itemsData,
            actionSuccess: 'Sussess',
            createdAt: new Date()
        })

        return await this.assetListFileModel.insertMany(itemsData)
    }

    async getListFiles(assetId: string) {
        const files = await this.assetListFileModel.find({ assetId, status: 1 }).exec()
        
        if (files.length > 0) {
            return files
        } else {
            return []
        }
    }

    async voidFileById(_id: string) {
        const check = await this.assetListFileModel.findOne({ _id })

        if (check) {
            const res = await this.assetListFileModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            }).exec()
    
            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Asset(File)',
                    actionMethod: 'GET',
                    actionFrom: 'Asset(File)',
                    actionData: {
                        _id,
                        status: 0,
                        updateAt: new Date()
                    },
                    actionSuccess: 'Success',
                    createdAt: new Date()
                })
    
                return {
                    finished: true,
                    msg: 'Void successfully!'
                }
            }
        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Asset(File)',
                actionMethod: 'GET',
                actionFrom: 'Asset(File)',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This file has been void! Please contact admin!'
            }
        }
    }

    async loadFileByAssetId(assetId: string) {
        return this.assetListFileModel.find({ assetId, status: 1}).exec()
    }

    async importData(uploadDatas: UploadAssetListDto[]) {
        for (const data of uploadDatas) {
            let { 
                assetCode, 
                assetName, 
                taxCountryCode, 
                taxCode, 
                taxRate, 
                typeCode,
                typeName,
                deptCode,
                deptName,
                placeCode,
                placeName,
                purchaseDate,
                sponsor,
                includeTax,
                afterBeforeTax,
                cost,
                maintenancePeriodStart,
                maintenancePeriodEnd,
                voucherUsedDate,
                invoiceDate,
                ..._data 
            } = data

            let typeId = '', deptId = '', placeId = '', taxInfofId = ''
            
            const checkAssetName = await this.assetListModel.findOne({ assetName }).exec()

            if (typeof taxRate === 'string') {
                if (taxRate.includes('%')) {
                    taxRate = Number(taxRate.replace('%', '')) / 100
                } else {
                    taxRate = Number(taxRate) / 100
                }
            }

            if (taxCode && taxCountryCode && taxRate) {
                const taxInfo = await this.taxInfoModel.findOne({ taxCode, countryCode: taxCountryCode }).exec()

                if (taxInfo) {
                    typeId = taxInfo._id.toString()
                } else {
                    const createType: any = await this.taxInfoSerivce.create({ 
                        taxCode, 
                        countryCode: taxCountryCode,
                        taxRate, 
                        taxName: '', 
                        taxType: '',  
                        nationCode: '',
                        nationName: '',
                        countryName: '',
                        importRate: 0,
                        remark: ''
                    })
                    typeId = createType._id.toString()
                }
            }

            if (typeCode || typeName) {
                const checkAssetType = await this.assetTypeModel.findOne({ 
                    ...typeCode? { typeCode } : {},
                    ...typeName? { typeName } : {}
                })
                
                if (checkAssetType) {
                    typeId = checkAssetType._id.toString()
                } else {
                    const createType: any = await this.assetTypeService.create({ typeCode, typeName})
                    typeId = createType._id.toString()
                }
            }

            if (deptCode || deptCode) {
                const checkDepartment = await this.departmentModel.findOne({ 
                    ...deptCode? { deptCode } : {},
                    ...deptName? { deptName } : {}
                })
                
                if (checkDepartment) {
                    deptId = checkDepartment._id.toString()
                } else {
                    const createType: any = await this.departmentService.create({ deptCode, deptName })
                    deptId = createType._id.toString()
                }
            }

            if (placeCode || placeCode) {
                const checkLocation = await this.locationModel.findOne({ 
                    ...placeCode? { placeCode } : {},
                    ...placeName? { placeName } : {}
                })
                
                if (checkLocation) {
                    placeId = checkLocation._id.toString()
                } else {
                    const createPlace: any = await this.locationService.create({ placeCode, placeName, remark: '' })
                    placeId = createPlace._id.toString()
                }
            }

                // Date Formatter
            if (purchaseDate) {
                purchaseDate = new Date(purchaseDate).toISOString()
            }
            if (maintenancePeriodStart) {
                maintenancePeriodStart = new Date(maintenancePeriodStart).toISOString()
            }
            if (maintenancePeriodEnd) {
                maintenancePeriodEnd = new Date(maintenancePeriodEnd).toISOString()
            }
            if (voucherUsedDate) {
                voucherUsedDate = new Date(voucherUsedDate).toISOString()
            }
            if (invoiceDate) {
                invoiceDate = new Date(invoiceDate).toISOString()
            }

            // Boolean Transformer
            if (sponsor === 'Yes') {
                sponsor = true
            } else {
                sponsor = false
            }

            if (includeTax === 'Yes') {
                includeTax = true
            } else {
                includeTax = false
            }

            // Number Transformer
            if (typeof cost === 'string') {
                cost = Number(cost)
            }

            if (typeof cost === 'string') {
                cost = Number(cost)
            }
            
            if (typeof afterBeforeTax === 'string') {
                afterBeforeTax = Number()
            }

            const finalData = {
                assetName,
                taxInfofId,
                typeId,
                deptId,
                placeId,
                taxCountryCode, 
                taxCode, 
                taxRate, 
                typeCode,
                typeName,
                deptCode,
                deptName,
                placeCode,
                placeName,
                purchaseDate,
                sponsor,
                includeTax,
                afterBeforeTax,
                cost,
                maintenancePeriodStart,
                maintenancePeriodEnd,
                voucherUsedDate,
                invoiceDate,
                ..._data
            }

            if (checkAssetName) {
                await this.update({ ...finalData, assetCode, _id: checkAssetName._id.toString() })
            } else {
                await this.create({ ...finalData, assetCode, _id: '' })
            }
        }
    }
}