/// <reference types="jest" />
import { DepartmentService } from './department.service'
import { Model } from 'mongoose'
import { Department } from './department.schame'
import { ActionRecordService } from '../action-record/actionRecord.service'

describe('DepartmentService', () => {
    let service: DepartmentService
    let model: jest.Mock & { find: jest.Mock; findOne: jest.Mock; updateOne: jest.Mock }
    let save: jest.Mock
    let saveRecord: jest.Mock
    const dto = { deptCode: 'HR', deptName: 'Human Resources', remark: 'TESTING' }
    const id = 'dept-1'
    const voided = { error: 'This department has been voided! Please contact admin!' }
    const query = (result: unknown) => ({ exec: jest.fn().mockResolvedValue(result) })

    beforeEach(() => {
        save = jest.fn()
        model = Object.assign(jest.fn().mockImplementation(() => ({ save })), {
            find: jest.fn(), findOne: jest.fn(), updateOne: jest.fn(),
        })
        saveRecord = jest.fn().mockResolvedValue(undefined)
        service = new DepartmentService(model as unknown as Model<Department>, { saveRecord } as unknown as ActionRecordService)
    })

    it('findAll returns active departments', async () => {
        model.find.mockReturnValue(query([dto]))
        expect(await service.findAll()).toEqual([dto])
        expect(model.find).toHaveBeenCalledWith({ status: 1 })
    })

    it('creates an active department, removes the supplied ID and records success', async () => {
        model.findOne.mockResolvedValue(null)
        save.mockResolvedValue({ ...dto, _id: id })
        expect(await service.create({ ...dto, _id: 'ignored' })).toEqual({ ...dto, _id: id })
        expect(model.findOne).toHaveBeenCalledWith({ deptCode: dto.deptCode, deptName: dto.deptName, status: 1 })
        const data = { ...dto, status: 1, createdAt: expect.any(Date) }
        expect(model).toHaveBeenCalledWith(data)
        expect(save).toHaveBeenCalledTimes(1)
        expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionName: 'Create Department', actionMethod: 'POST', actionFrom: 'Department', actionData: data, actionSuccess: 'Success', createdAt: expect.any(Date) }))
    })

    it('rejects duplicate creation and records failure', async () => {
        model.findOne.mockResolvedValue(dto)
        expect(await service.create(dto)).toEqual({ error: 'This department already exist!' })
        expect(model).not.toHaveBeenCalled()
        expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionData: dto, actionSuccess: 'FAILURE' }))
    })

    it('propagates save failures', async () => {
        model.findOne.mockResolvedValue(null)
        const error = new Error('Save failed')
        save.mockRejectedValue(error)
        await expect(service.create(dto)).rejects.toBe(error)
    })

    it('updates an active department and records the action', async () => {
        model.findOne.mockReturnValue(query({ status: 1 }))
        const result = { modifiedCount: 1 }
        model.updateOne.mockReturnValue(query(result))
        expect(await service.update({ ...dto, _id: id })).toBe(result)
        expect(model.findOne).toHaveBeenCalledWith({ _id: id })
        expect(model.updateOne).toHaveBeenCalledWith({ _id: id }, { ...dto, updatedAt: expect.any(Date) })
        expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionName: 'Update Department', actionData: { ...dto, updatedAt: expect.any(Date) } }))
    })

    it('rejects updates to voided departments', async () => {
        model.findOne.mockReturnValue(query({ status: 0 }))
        expect(await service.update({ ...dto, _id: id })).toEqual(voided)
        expect(model.updateOne).not.toHaveBeenCalled()
        expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionSuccess: 'FAILURE' }))
    })

    it.each([null, { ...dto, _id: id }])('handles lookup result %p', async (result) => {
        model.findOne.mockReturnValue(query(result))
        expect(await service.getOneById(id)).toEqual(result ?? voided)
        expect(model.findOne).toHaveBeenCalledWith({ _id: id, status: 1 })
    })

    it('rejects repeated invalidation', async () => {
        model.findOne.mockReturnValue(query({ status: 0 }))
        expect(await service.invalidateDepartment(id)).toEqual(voided)
        expect(model.updateOne).not.toHaveBeenCalled()
        expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionName: 'Void Department', actionSuccess: 'FAILURE', actionData: { _id: id } }))
    })

    it.each([0, 1])('handles invalidation modifiedCount = %s', async (modifiedCount) => {
        model.findOne.mockReturnValue(query({ status: 1 }))
        model.updateOne.mockReturnValue(query({ modifiedCount }))
        expect(await service.invalidateDepartment(id)).toEqual(modifiedCount === 1
            ? { message: 'Void department successfully!' }
            : { error: 'Ooops! Something went wrong! Please try again!' })
        expect(model.updateOne).toHaveBeenCalledWith({ _id: id }, { status: 0, updateAt: expect.any(Date) })
        if (modifiedCount === 1) {
            expect(saveRecord).toHaveBeenCalledWith(expect.objectContaining({ actionName: 'Void Department', actionMethod: 'GET', actionSuccess: 'Success', actionData: { _id: id, status: 0, updateAt: expect.any(Date) } }))
        } else {
            expect(saveRecord).not.toHaveBeenCalled()
        }
    })

    describe.each([undefined, '', 'HR'])('filter name = %p', (name) => {
        const filters = name ? { status: 1, $or: [
            { deptName: { $regex: name, $options: 'i' } },
            { deptCode: { $regex: name, $options: 'i' } },
        ] } : { status: 1 }

        it('lists active departments using optional filters', async () => {
            model.find.mockReturnValue(query([dto]))
            expect(await service.listWithFilters({ page: 1, limit: 10, name })).toEqual([dto])
            expect(model.find).toHaveBeenCalledWith(filters)
        })

        it.each([0, 21])('paginates total = %s', async (total) => {
            const rows = total ? [dto] : []
            const findQuery = { ...query(rows), skip: jest.fn().mockReturnThis(), limit: jest.fn().mockReturnThis() }
            const countDocuments = jest.fn().mockReturnValue(query(total))
            model.find.mockReturnValueOnce(findQuery).mockReturnValueOnce({ countDocuments })
            expect(await service.listPage({ page: 2, limit: 10, name })).toEqual({ total, page: 2, limit: 10, totalPages: Math.ceil(total / 10), lists: rows })
            expect(model.find).toHaveBeenNthCalledWith(1, filters)
            expect(model.find).toHaveBeenNthCalledWith(2, filters)
            expect(findQuery.skip).toHaveBeenCalledWith(10)
            expect(findQuery.limit).toHaveBeenCalledWith(10)
            expect(countDocuments).toHaveBeenCalledTimes(1)
        })
    })

    it('imports by updating existing departments and creating new ones', async () => {
        const second = { deptCode: 'IT', deptName: 'Technology', remark: 'New' }
        model.findOne.mockReturnValueOnce(query({ _id: { toString: () => id } })).mockReturnValueOnce(query(null))
        const update = jest.spyOn(service, 'update').mockResolvedValue({ modifiedCount: 1 } as any)
        const create = jest.spyOn(service, 'create').mockResolvedValue(dto as any)
        await expect(service.importData([dto, second])).resolves.toBeUndefined()
        expect(update).toHaveBeenCalledWith({ ...dto, _id: id })
        expect(create).toHaveBeenCalledWith(second)
        expect(model.findOne).toHaveBeenNthCalledWith(1, { deptCode: dto.deptCode, deptName: dto.deptName, status: 1 })
        expect(model.findOne).toHaveBeenNthCalledWith(2, { deptCode: second.deptCode, deptName: second.deptName, status: 1 })
    })

    it('does nothing for an empty import', async () => {
        await expect(service.importData([])).resolves.toBeUndefined()
        expect(model.findOne).not.toHaveBeenCalled()
        expect(model).not.toHaveBeenCalled()
        expect(saveRecord).not.toHaveBeenCalled()
    })

    it('propagates lookup failures and stops importing', async () => {
        const error = new Error('Lookup failed')
        model.findOne.mockReturnValue({ exec: jest.fn().mockRejectedValue(error) })
        await expect(service.importData([dto, dto])).rejects.toBe(error)
        expect(model.findOne).toHaveBeenCalledTimes(1)
    })
})

