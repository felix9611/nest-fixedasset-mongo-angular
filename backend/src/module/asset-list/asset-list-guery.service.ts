import { Injectable } from '@nestjs/common'
import { InvRecordService } from '../InvRecord/InvRecord.service'
import { Model } from 'mongoose'
import { AssetList } from './asset-list.schame'
import { InjectModel } from '@nestjs/mongoose'
import { DashboardReqDto, DashboardReqFilterDto } from './asset-list.dto'
import { groupBy } from 'rxjs'

@Injectable()
export class AssetListQueryService {
    constructor(
        @InjectModel(AssetList.name) private assetListModel: Model<AssetList>,
        private invRecordService: InvRecordService
    ) {}


    getGroupByType() {
        return {
            lookUp: {
                from: 'assettypes', // Ensure correct collection name
                let: { typeIdStr: { $toObjectId: '$typeId' } }, // Convert deptId to ObjectId
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$typeIdStr'] } } }],
                as: 'assettype'
            },
            unwind: { path: '$assettype', preserveNullAndEmptyArrays: true },
            groupBy: {
                typeName: "$assettype.typeName"
            },
            project: {
                typeName: "$_id.typeName"
            }
        }
    }

    getGroupByDept() {
        return {
            lookUp: {
                from: 'departments', // Ensure correct collection name
                let: { deptIdStr: { $toObjectId: '$deptId' } }, // Convert deptId to ObjectId
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$deptIdStr'] } } }],
                as: 'department'
            },
            unwind: { path: '$department', preserveNullAndEmptyArrays: true },
            groupBy: {
                deptName: "$department.deptName"
            },
            project: {
                deptName: "$_id.deptName"
            }
        }
    }

    getGroupByLocations() {
        return {
            lookUp: {
                from: 'locations', // Ensure correct collection name
                let: { placeIdStr: { $toObjectId: '$placeId' } }, // Convert placeId to ObjectId
                pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$placeIdStr'] } } }],
                as: 'location'
            },
            unwind: { path: '$location', preserveNullAndEmptyArrays: true },
            groupBy: {
                placeName: "$location.placeName"
            },
            project: {
                placeName: "$_id.placeName"
            } 
        }
    }

    getGroupByYearMonth() {
        return {
            groupBy: {
                year: { $year: "$purchaseDate" },
                month: { $month: "$purchaseDate" },
            },
            sort: { "_id.year": 1, "_id.month": 1 },
            project: {
                year: { $toString: "$_id.year" },
                month: { $toString: "$_id.month" },
                monthString: {
                    "$arrayElemAt": [
                        [
                            "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                        ],
                        "$_id.month"
                    ]
                }
            }
        }
    }

    getGroupByYearQuarter() {
        return {
            groupBy: {
                year: { $year: "$purchaseDate" },
                quarter: {
                    $switch: {
                        branches: [
                            { "case": { "$lte": [{ "$month": "$purchaseDate" }, 3] }, "then": "Q1" },
                            { "case": { "$lte": [{ "$month": "$purchaseDate" }, 6] }, "then": "Q2" },
                            { "case": { "$lte": [{ "$month": "$purchaseDate" }, 9] }, "then": "Q3" },
                            { "case": { "$lte": [{ "$month": "$purchaseDate" }, 12] }, "then": "Q4" }
                        ]
                    }
                }
            },
            sort: { "_id.year": 1 },
            project: {
                yearQuarter: {
                    $concat: [
                      { $toString: "$_id.year" },
                      "-",
                      { $toString: "$_id.quarter" }
                    ]
                }  
            }
        }
    }

    getGroupByUnit() {
        return {
            costs: {
                groupBy: {
                    costs: { $sum: "$cost" }
                },
                project: {
                    costs: 1
                }
            },
            counts: {
                groupBy: {
                    count: { $sum: 1 }
                },
                project: {
                    count: 1
                }
            }
        }
    }

    async queryMakerForData(query: DashboardReqDto) {

        const { dataType, dataTypeValue, valueField, filter } = query
        let dateTypeObj: any = {}

        const filters = filter ? this.getFilter(filter) : {}

        const finalFilter = {
            $match: {
                status: 1,
                ...filters
            }
        }

        let dataTypeObj: any = {}

        if (dataType === true) {
            
            switch (dataTypeValue) {
                case 'dept':
                    dataTypeObj = this.getGroupByDept()
                break

                case 'type':
                    dataTypeObj = this.getGroupByType()
                break

                case 'location':
                    dataTypeObj = this.getGroupByLocations()
                break
            }
        }

        const valueObj = this.getGroupByUnit()

        const finalGroupBy: any = {
            $group: {
                _id: {
                    ...dataType ? dataTypeObj.groupBy : {},
                },
                ...valueObj && valueObj[valueField] ? valueObj[valueField].groupBy : null
            }
        }

        const finalFields: any = {
            $project: {
                _id: 0,
                ...dataType ? dataTypeObj.project : {},
                ...valueObj && valueObj[valueField] ? valueObj[valueField].project : {}
            }
        }


        const finalQuery: any = [
            finalFilter,
            finalGroupBy,
            finalFields,
        ]


        return await this.assetListModel.aggregate(finalQuery).exec()
    }

    async queryMakerForDateAndData(query: DashboardReqDto) {

        const { dataType, dataTypeValue, dateType, dateTypeValue, valueField, filter } = query

        let dataTypeObj: any = {}
        let dateTypeObj: any = {}

        const filters = filter ? this.getFilter(filter) : {}

        const finalFilter = {
            $match: {
                status: 1,
                ...filters
            }
        }

        if (dataType === true) {
            
            switch (dataTypeValue) {
                case 'dept':
                    dataTypeObj = this.getGroupByDept()
                break

                case 'type':
                    dataTypeObj = this.getGroupByType()
                break

                case 'location':
                    dataTypeObj = this.getGroupByLocations()
                break
            }
        }

        if (dateType === true) {
            switch (dateTypeValue) {
                case 'YearMonth':
                    dateTypeObj = this.getGroupByYearMonth()
                break
            }
        }

        const valueObj = this.getGroupByUnit()

        const finalLookUp: any = 
            dataType ? { $lookup: dataTypeObj.lookUp } : {}
        
        const finalUnwind: any = 
            dataType ? { $unwind: dataTypeObj.unwind } : {}
        

        const finalGroupBy: any = {
            $group: {
                _id: {
                    ...dateType ? dateTypeObj.groupBy : {},
                    ...dataType ? dataTypeObj.groupBy : {},
                },
                ...valueObj && valueObj[valueField] ? valueObj[valueField].groupBy : null
            }
        }

        const finalFields: any = {
            $project: {
                _id: 0,
                ...dateType ? dateTypeObj.project : {},
                ...dataType ? dataTypeObj.project : {},
                ...valueObj && valueObj[valueField] ? valueObj[valueField].project : {}
            }
        }


        const finalQuery: any = [
            finalFilter,
            finalLookUp,
            finalUnwind,
            finalGroupBy,
            dateType ? { $sort: dateTypeObj.sort } : {},
            finalFields,
        ]


        return await this.assetListModel.aggregate(finalQuery).exec()
    }

    getFilter(query: DashboardReqFilterDto) {
        
        const { typeIds, placeIds, deptIds, purchaseDates } = query

        return {  
            ... purchaseDates && purchaseDates.length > 0 ? { purchaseDate: { $gte: new Date(purchaseDates[0]), $lte: new Date(purchaseDates[1]) }} : {},
            ... deptIds && deptIds.length > 0 ? { deptId: { $in: deptIds } } : {},
            ...typeIds && typeIds.length > 0 ? { typeId: { $in: typeIds } } : {},
            ...placeIds && placeIds.length > 0 ? { placeId: { $in: placeIds } } : {},
            
        }
    }
}