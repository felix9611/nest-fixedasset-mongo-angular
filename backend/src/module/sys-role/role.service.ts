import { Injectable } from '@nestjs/common'
import { SysRole } from './role.schame'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'
import { CreateSysRoleDto, ListRoleRequestDto, UpdateSysRoleDto } from './role.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class SysRoleService {
    constructor(
        @InjectModel(SysRole.name) private sysRoleModel: Model<SysRole>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<SysRole[]> {
        return this.sysRoleModel.find({
            status: 1
        }).exec();
    }

    async create(createData: UpdateSysRoleDto) {
        const { code, name, _id, ..._data } = createData

        const checkData = await this.checkRoleExist(name, code)

        if (checkData) {

            await this.actionRecordService.saveRecord({
                actionName: 'Create Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: createData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This role already exist!'
            }
        } else {
            const finalData = {
                name,
                code, 
                ..._data,
                status: 1,
                createdAt: new Date()
            }

           await this.actionRecordService.saveRecord({
                actionName: 'Create Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            const created = new this.sysRoleModel(finalData)
            return await created.save()
        }
    }

    async update(updateData: UpdateSysRoleDto) {
        const { _id, code, name, ..._data } = updateData

        const checkData = await this.sysRoleModel.findOne({ _id, status: 1})
        if (checkData) {
            const finalData = {
                name,
                code, 
                ..._data,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.sysRoleModel.updateOne({ _id}, finalData)
        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: updateData,
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This role has been invalidated! Please contact admin!'
              }
        }
    }

    async updateRoleMenuPermission(_id: string, menuIds: any) {
        const checkData = await this.sysRoleModel.findOne({ _id })
        if (checkData) {
            const finalData = {
                menuIds,
                updatedAt: new Date()
            }

            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: finalData,
                actionSuccess: 'Sussess',
                createdAt: new Date()
            })

            return await this.sysRoleModel.updateOne({ _id}, finalData)

        } else {
            await this.actionRecordService.saveRecord({
                actionName: 'Update Role',
                actionMethod: 'POST',
                actionFrom: 'Role',
                actionData: {
                    menuIds,
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })

            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateRole(_id: string) {
        const checkData = await this.sysRoleModel.findOne({ _id })

        if (checkData?.status === 0) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void Role',
                actionMethod: 'GET',
                actionFrom: 'Role',
                actionData: {
                    _id
                },
                actionSuccess: 'FAILURE',
                createdAt: new Date()
            })


            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.sysRoleModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            })
        
            if (res.modifiedCount === 1) {
                await this.actionRecordService.saveRecord({
                    actionName: 'Void Role',
                    actionMethod: 'GET',
                    actionFrom: 'Role',
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
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
    }

    async getOneById(_id: string) {
        const data = await this.sysRoleModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        }
    }

    async listPageRole(request: ListRoleRequestDto) {
        const { page, limit, name } = request

        const skip = (page - 1) * limit

        const filters = {
            ...name ? {
                $or: [
                    {
                        code: { $regex: name, $options: 'i' }
                    },
                    {
                        code: { $regex: name, $options: 'i' }
                    }
                ],
            } : {},
            status: 1
        }

        const lists = await this.sysRoleModel.find(filters).skip(skip)
            .limit(limit)
            .exec()
        const total = await this.sysRoleModel.countDocuments()

        return {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            lists,
        }
    }

    async getRolelistsByIds(ids: string[]) {
        return await this.sysRoleModel.find({ _id: { $in: ids }, status: 1 })
    }

    async checkRoleExist(name: string, code: string) {
        return await this.sysRoleModel.findOne({ name, code, status: 1})
    }
}