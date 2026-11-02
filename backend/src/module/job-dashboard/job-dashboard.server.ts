import { Injectable } from '@nestjs/common'
import { JobDashboard } from './job-dashboard.schema'
import { InjectModel } from '@nestjs/mongoose'
import { ActionRecordService } from '../action-record/actionRecord.service'
import { Model } from 'mongoose'

@Injectable()
export class JobDashboardService {
    constructor(
        @InjectModel(JobDashboard.name) private jobDashboardModel: Model<JobDashboard>,
        private actionRecordService: ActionRecordService
    ) {}

    async createJobDashboard(jobDashboard: JobDashboard) {
        const { _id, number, title, ..._description } = jobDashboard

        const check = await this.jobDashboardModel.findOne({ title })

        if (check) {
            await this.actionRecordService.saveRecord({
                actionName: 'Create Job Card',
                actionMethod: 'POST',
                actionFrom: 'Job Dashboard',
                actionData: jobDashboard,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                error: 'This title already exist! Please create new one!'
            }
        } else {

            const newNumber = await this.createNewNumber()

            const newData: JobDashboard = {
                ...jobDashboard,
                number: newNumber,
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 1,
                jobValid: true
            }

            const createdJobDashboard = new this.jobDashboardModel(newData)

            const res = await createdJobDashboard.save()

            if (res) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Job Card',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: newData,
                    actionSuccess: 'SUCCESS',
                    createdAt: new Date()
                })
                return {
                    message: 'Job Card created successfully!',
                    data: res
                }
            } else {
                await this.actionRecordService.saveRecord({
                    actionName: 'Create Job Card',
                    actionMethod: 'POST',
                    actionFrom: 'Job Dashboard',
                    actionData: newData,
                    actionSuccess: 'FAILURE',
                    createdAt: new Date()
                })
                return {
                    error: 'Failed to create Job Card!'
                }
            }
        }
    } 


    /// get number
    formatNumber(num: number, digits: number): string {
        return (num + 1).toString().padStart(digits, '0')
    }

    async createNewNumber() {
        const result = await this.jobDashboardModel.aggregate([
            {
              $addFields: { numberInt: { $toInt: "$number" } } // Convert to integer
            },
            {
              $group: { 
                _id: null, 
                maxNumber: { $max: "$numberInt" } // Find max
              }
            }
        ]).exec()

        const maxNumber = result.length > 0 ? result[0].maxNumber : 0
        if (maxNumber == null) {
            return this.formatNumber(0, 8)
        } else {
            return this.formatNumber(maxNumber, 8)
        }
    }

    async updateJobDashboard(jobDashboard: JobDashboard) {
        const { _id, ..._description } = jobDashboard

        const check = await this.jobDashboardModel.findOne({ _id })

        if (check?.jobValid === false) {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Job Card',
                actionMethod: 'PUT',
                actionFrom: 'Job Dashboard',
                actionData: jobDashboard,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                error: 'This Job Card has been voided! Please contact admin!'
            }
        } else {
            const finalData = {
                ...jobDashboard,
                updatedAt: new Date()
            }

            const res = await this.jobDashboardModel.updateOne({ _id }, finalData)

            if (res.modifiedCount > 0) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Job Card',
                    actionMethod: 'PUT',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'SUCCESS',
                    createdAt: new Date()
                })
                return {
                    message: 'Job Card updated successfully!',
                    data: res
                }
            } else {
                await this.actionRecordService.saveRecord({
                    actionName: 'Update Job Card',
                    actionMethod: 'PUT',
                    actionFrom: 'Job Dashboard',
                    actionData: finalData,
                    actionSuccess: 'FAILURE',
                    createdAt: new Date()
                })
                return {
                    error: 'Failed to update Job Card!'
                }
            }
        }
    }
}