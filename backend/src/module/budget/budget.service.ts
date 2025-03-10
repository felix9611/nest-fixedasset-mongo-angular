import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Budget } from './budget.schame'
import { Model } from 'mongoose'
import { CreateBudgetDto, ListBudgetRequestDto, UpdateBudgetDto } from './budget.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class BudgetService {
    constructor(
        @InjectModel(Budget.name) private budgetModel: Model<Budget>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Budget[]> {
        return this.budgetModel.find({
            status: 1
        }).exec();
    }

    async create(createData: UpdateBudgetDto) {
        const { _id, budgetName, year, month, ..._data } = createData

        const checkData = await this.budgetModel.findOne({ budgetName, year, month, status: 1})

        if (checkData) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget already exist!'
            }
        } else {
            const budgetNo = this.getRandom10Digit()
            const finalData = {
                ..._data,
                budgetName, 
                year, 
                month,
                status: 1,
                budgetNo, 
                createdAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Create Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const create = new this.budgetModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateBudgetDto) {
        const { _id, ...data } = updateData

        const checkData: any = await this.budgetModel.findOne({ _id })

        if (checkData.status === 1) {

            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.budgetModel.updateOne({ _id}, finalData)

        } else {

            await this.actionRecordService.saveRecord({
                actionName: 'Update Budget',
                actionMethod: 'POST',
                actionFrom: 'Budget',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This budget has been invalidated! Please contact admin!'
            }
        }
    }

    async getOneById(_id: string) {
        const data = await this.budgetModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This budget has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidate(_id: string) {
        const checkData = await this.budgetModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Budget',
                actionMethod: 'GET',
                actionFrom: 'Budget',
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
                await this.budgetModel.updateOne({ _id}, {
                    status: 0,
                    updateAt: new Date()
                })
        
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Budget',
                    actionMethod: 'GET',
                    actionFrom: 'Location',
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

    async listPageRole(request: ListBudgetRequestDto) {
            const { page, limit, name, date, deptId, placeId } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ... name ? {budgetName: { $regex: name, $options: 'i' }}: {},
                ... deptId ? { deptId: { $in: deptId } } : {},
                ... placeId ? { placeId: { $in: placeId } } : {},
                ... date && date?.length > 0 ? { budgetFrom: { $gte: date[0], $lte: date[1] } } : {},
                status: 1
            }
    
            const lists = await this.budgetModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.budgetModel.countDocuments()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                lists
            }
    }

    async getBudgetSummary() {
        return this.budgetModel.aggregate([
            {
              $group: {
                _id: {
                  year: { $year: "$budgetFrom" },
                  month: { $month: "$budgetFrom" }
                },
                budgetAmount: { $sum: "$budgetAmount" }
              }
            },
            {
              $project: {
                _id: 0,
                budgetAmount: 1,
                yearMonth: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    {
                      $dateToString: { 
                        format: "%B", 
                        date: { 
                          $dateFromParts: { 
                            year: "$_id.year", 
                            month: "$_id.month", 
                            day: 1 
                          } 
                        } 
                      }
                    }
                  ]
                },
                year: "$_id.year",
                month: "$_id.month"
              }
            },
            { $sort: { year: 1, month: 1 } }
        ])
          
    }

    getRandom10Digit(): string {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString()
    }
}