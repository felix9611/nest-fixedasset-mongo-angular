import { Test, TestingModule } from '@nestjs/testing'
import { BudgetController } from './budget.controller'
import { BudgetService } from './budget.service'
import { AuthGuard } from '../auth/AuthGuard'

describe('BudgetController', () => {
    let controller: BudgetController
    let service: BudgetService

    const mockBudgetService = {
        create: jest.fn(),
        update: jest.fn(),
        getOneById: jest.fn(),
        invalidate: jest.fn(),
        findAll: jest.fn(),
        listPage: jest.fn(),
        importData: jest.fn(),
        getBudgetSummary: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [BudgetController],
          providers: [
            {
              provide: BudgetService,
              useValue: mockBudgetService,
            },
          ],
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();
    
        controller = module.get<BudgetController>(BudgetController)
        service = module.get<BudgetService>(BudgetService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('create', () => {
        it('should call service.create and return the result', async () => {
            const dto = { 
                deptId: '1', 
                placeId: '2', 
                budgetName: 'Tongs', 
                year: '2025', 
                month: '3', 
                budgetAmount: 1.5, 
                budgetFrom: '2025-03-01', 
                budgetTo: '2025-03-31', 
                budgetStatus: 'TEST', 
                remark: 'test' 
            }
          const result = { _id: '1', ...dto }
          mockBudgetService.create.mockResolvedValue(result)
    
          expect(await controller.create(dto)).toEqual(result)
          expect(mockBudgetService.create).toHaveBeenCalledWith(dto)
        })
    })

    describe('update', () => {
        it('should call service.update and return the result', async () => {
            const dto = { 
                _id: '1',
                deptId: '1', 
                placeId: '2', 
                budgetName: 'Tongs', 
                year: '2025', 
                month: '3', 
                budgetAmount: 1.5, 
                budgetFrom: '2025-03-01', 
                budgetTo: '2025-03-31', 
                budgetStatus: 'TEST', 
                remark: 'test' 
            }
             const result = { msg: 'Updated successfully' }
            mockBudgetService.update.mockResolvedValue(result)
    
            expect(await controller.update(dto)).toEqual(result)
            expect(mockBudgetService.update).toHaveBeenCalledWith(dto)
        })
    })

    describe('getOneById', () => {
        it('should call service.getOneById and return the result', async () => {
          const id = '123'
          const result = { 
                _id: '1',
                deptId: '1', 
                placeId: '2', 
                budgetName: 'Tongs', 
                year: '2025', 
                month: '3', 
                budgetAmount: 1.5, 
                budgetFrom: '2025-03-01', 
                budgetTo: '2025-03-31', 
                budgetStatus: 'TEST', 
                remark: 'test' 
            }
            mockBudgetService.getOneById.mockResolvedValue(result)
    
            expect(await controller.getOneById(id)).toEqual(result)
            expect(mockBudgetService.getOneById).toHaveBeenCalledWith(id)
        })

        describe('removeById', () => {
            it('should call service.invalidate and return the result', async () => {
              const id = '123'
              const result = { msg: 'Removed successfully' }
              mockBudgetService.invalidate.mockResolvedValue(result)
              expect(await controller.removeById(id)).toEqual(result)
              expect(mockBudgetService.invalidate).toHaveBeenCalledWith(id)
            })
        })

        describe('getAll', () => {
            it('should call service.findAll and return the result', async () => {
                const result = [{ 
                    _id: '1',
                    deptId: '1', 
                    placeId: '2', 
                    budgetName: 'Tongs', 
                    year: '2025', 
                    month: '3', 
                    budgetAmount: 1.5, 
                    budgetFrom: '2025-03-01', 
                    budgetTo: '2025-03-31', 
                    budgetStatus: 'TEST', 
                    remark: 'test' 
                }]
                mockBudgetService.findAll.mockResolvedValue(result)
        
                expect(await controller.getAll()).toEqual(result)
                expect(mockBudgetService.findAll).toHaveBeenCalled()
        })

        describe('listAndPage', () => {
                it('should call service.listPageRole and return the result', async () => {
                  const dto: any = { page: 1, limit: 10 }
                  const result = { total: 0, totalPages: 0, list: [], ...dto }
                  mockBudgetService.listPage.mockResolvedValue(result)
            
                  expect(await controller.listAndPage(dto)).toEqual(result)
                  expect(mockBudgetService.listPage).toHaveBeenCalledWith(dto)
                })
            })
        })
    })

    describe('importData', () => {
        it('should call service.importData and return the result', async () => {
            const dto: any = [{ 
                deptId: '1', 
                placeId: '2', 
                budgetNo: '333',
                budgetName: 'Tongs', 
                year: '2025', 
                month: '3', 
                budgetAmount: 1.5, 
                budgetFrom: '2025-03-01', 
                budgetTo: '2025-03-31', 
                budgetStatus: 'TEST', 
                remark: 'test' 
            }]
          const result = { msg: 'Imported successfully' }
          mockBudgetService.importData.mockResolvedValue(result)
    
          expect(await controller.importData(dto)).toEqual(result)
          expect(mockBudgetService.importData).toHaveBeenCalledWith(dto)
        })
    })
})
