/// <reference types="jest" />
import { HttpException, HttpStatus } from '@nestjs/common'
import { DepartmentController } from './department.controller'
import { DepartmentService } from './department.service'
import { JwtPayload } from '../auth/auth.dto'

describe('DepartmentController', () => {
    const dto = { _id: 'dept-123', deptCode: 'HR', deptName: 'Human Resources', remark: 'TESTING' }
    const query = { page: 2, limit: 10, name: 'HR' }
    const user: JwtPayload = {
        sub: 'admin', username: 'admin', departmentIds: [], placeIds: [],
        roles: [], superAdmin: true,
    }
    const cases = [
        { method: 'create', args: [dto], serviceMethod: 'create' },
        { method: 'update', args: [dto], serviceMethod: 'update' },
        { method: 'getOneById', args: ['dept-1'], serviceMethod: 'getOneById' },
        { method: 'removeById', args: ['dept-1'], serviceMethod: 'invalidateDepartment' },
        { method: 'getAll', args: [], serviceMethod: 'findAll' },
        { method: 'listWithFilters', args: [query], serviceMethod: 'listWithFilters' },
        { method: 'listAndPage', args: [query], serviceMethod: 'listPage' },
        { method: 'importData', args: [[dto]], serviceMethod: 'importData' },
    ] as const
    let controller: DepartmentController
    let service: Record<string, jest.Mock>

    beforeEach(() => {
        service = Object.fromEntries(cases.map(({ serviceMethod }) => [serviceMethod, jest.fn()]))
        controller = new DepartmentController(service as unknown as DepartmentService)
    })

    describe.each(cases)('$method', ({ method, args, serviceMethod }) => {
        it('forwards super-admin requests and returns the service result', async () => {
            const result = { message: 'result' }
            service[serviceMethod].mockResolvedValue(result)
            expect(await controller[method](...([...args, { user }] as [any, any]))).toBe(result)
            expect(service[serviceMethod]).toHaveBeenCalledTimes(1)
            expect(service[serviceMethod]).toHaveBeenCalledWith(...args)
        })

        it('rejects non-super admin requests with 403 without calling the service', async () => {
            const request = controller[method](...([...args, { user: { ...user, superAdmin: false } }] as [any, any]))
            await expect(request).rejects.toBeInstanceOf(HttpException)
            await expect(request).rejects.toMatchObject({
                status: HttpStatus.FORBIDDEN, response: { message: 'Access denied' },
            })
            expect(service[serviceMethod]).not.toHaveBeenCalled()
        })

        it('propagates service failures', async () => {
            const error = new Error('Service unavailable')
            service[serviceMethod].mockRejectedValue(error)
            await expect(controller[method](...([...args, { user }] as [any, any]))).rejects.toBe(error)
        })
    })
})

