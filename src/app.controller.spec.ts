import { Test, TestingModule } from '@nestjs/testing'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { OcrModule } from './ocr/ocr.module'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot(),
          OcrModule,
        ],
      controllers: [AppController],
      providers: [AppService],
    }).compile()

    appController = app.get<AppController>(AppController)
  })

  describe('root', () => {
    it('should return "OCR Service Running!"', () => {
      expect(appController.getHealth()).toBe('OCR Service Running!')
    })
  })
})
