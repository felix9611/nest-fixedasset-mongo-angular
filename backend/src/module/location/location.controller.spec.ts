import { Test, TestingModule } from '@nestjs/testing'
import { AuthGuard } from '../auth/AuthGuard'
import { LocationController } from './location.controller'
import { LocationService } from './location.service'
import { create } from 'domain'

describe('LocationController', () => {
    let controller: LocationController
    let service: LocationService

    const mockLocationSerivce = {
        create: jest.fn(),
        update: jest.fn(),
        getOneById: jest.fn(),
        invalidate: jest.fn(),
        findAll: jest.fn(),
        listPage: jest.fn(),
        importData: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [LocationController],
            providers: [
                {
                    provide: LocationService,
                    useValue: mockLocationSerivce
                }
            ]
        })
        .overrideGuard(AuthGuard)
        .useValue({ canActivate: jest.fn(() => true) }).compile()

        controller = module.get<LocationController>(LocationController)
        service = module.get<LocationService>(LocationService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    describe('create', () => {
        it('should create a location successfully', async () => {
            const dto = { placeCode: 'Lab', placeName: 'Lab Room', remark: 'Tongs' }
            mockLocationSerivce.create.mockResolvedValue(dto)

            const result = await controller.create(dto)
            expect(result).toEqual(dto)
            expect(mockLocationSerivce.create).toHaveBeenCalledWith(dto)
        })
    })

    describe('update', () => {
        it('should update a location successfully', async () => {
            const dto = { id: '1',  placeCode: 'Lab', placeName: 'Lab Room', remark: 'Tongs' }
            mockLocationSerivce.update.mockResolvedValue(dto)

            const result = await controller.update(dto)
            expect(result).toEqual(dto)
            expect(mockLocationSerivce.update).toHaveBeenCalledWith(dto)
        })
    })

    describe('getOneById', () => {
        it('should call service.getOneById and return the result', async () => {
          const id = '123'
          const result = { _id: '123', placeCode: 'Lab', placeName: 'Lab Room', remark: 'Tongs' }
          mockLocationSerivce.getOneById.mockResolvedValue(result)
    
          expect(await controller.getOneById(id)).toEqual(result)
          expect(mockLocationSerivce.getOneById).toHaveBeenCalledWith(id)
        })
    })

    describe('listAndPage', () => {
        it('should return paginated location data', async () => {
            const req: any = { page: 1, size: 10 }
            const response: any = { total: 0, totalPages: 0, list: [], ...req }
            mockLocationSerivce.listPage.mockResolvedValue(response)

            const result = await controller.listAndPage(req)
            expect(result).toEqual(response)
            expect(mockLocationSerivce.listPage).toHaveBeenCalledWith(req)
        })
    })

    describe('removeById', () => {
        it('should invalidate a Location by ID', async () => {
            const id = '1';
            const message = { message: 'Location invalidated' }
            mockLocationSerivce.invalidate.mockResolvedValue(message)

            const result = await controller.removeById(id)
            expect(result).toEqual(message)
            expect(mockLocationSerivce.invalidate).toHaveBeenCalledWith(id)
        })
    })

    describe('getAll', () => {
        it('should return all departments', async () => {
            const departments = [{ _id: '123', placeCode: 'Lab', placeName: 'Lab Room', remark: 'Tongs' }]
            mockLocationSerivce.findAll.mockResolvedValue(departments)

            const result = await controller.getAll()
            expect(result).toEqual(departments)
            expect(mockLocationSerivce.findAll).toHaveBeenCalled()
        })
    })
   /* describe('importData', () => {
        it('should call service.importData for each item and return the result', async () => {
            const dto = [
                [{ placeCode: 'Office', placeName: 'Main Office', remark: 'Admin' }]
            ]
    
            const mockResponse = 
                [{ placeCode: 'Office', placeName: 'Main Office', remark: 'Admin' }]
            
    
            // Mock the service method to resolve each item
            mockLocationSerivce.create.mockImplementation((data) => Promise.resolve(data))
    
            // Call the controller method
            await controller.importData(dto)
    
            // Assertions
            expect(await controller.importData(dto)).toEqual(mockResponse)

            expect(mockLocationSerivce.create).toHaveBeenCalledWith(data)
        })
    }) */
})