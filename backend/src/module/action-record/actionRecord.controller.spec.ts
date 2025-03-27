import { Test, TestingModule } from '@nestjs/testing'
import { ActionRecordController } from './actionRecord.controller'
import { ActionRecordService } from './actionRecord.service'
import { AuthGuard } from '../auth/AuthGuard'

describe('ActionRecordController', () => {
    let controller: ActionRecordController
    let service: ActionRecordService

    const mockActionRecordService = {
        listAndPage: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ActionRecordController],
            providers: [
                {
                  provide: ActionRecordService,
                  useValue: mockActionRecordService,
                },
            ],
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn(() => true) })
        .compile();
        
        controller = module.get<ActionRecordController>(ActionRecordController)
        service = module.get<ActionRecordService>(ActionRecordService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('list', () => {
        it('should call service.listAndPage and return the result', async () => {
            const dto = { page: 1, limit: 10 }
            const result = { total: 0, totalPages: 0, list: [], ...dto }

            mockActionRecordService.listAndPage.mockResolvedValue(result)

            expect(await controller.list(dto)).toEqual(result)
            expect(mockActionRecordService.listAndPage).toHaveBeenCalledWith(dto)
        })
    })
})