import { Test, TestingModule } from '@nestjs/testing'
import { OcrController } from './ocr.controller'
import { OcrService } from './ocr.service'
import { OcrClient } from './client/ocr-api-client.abstract'
import { OcrApiClient } from './client/ocr-api-client'

describe('OcrController', () => {
  let controller: OcrController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OcrController],
        providers: [
          OcrService,
          {
            provide: OcrClient,
            useClass: OcrApiClient, 
          },
        ]
    }).compile()

    controller = module.get<OcrController>(OcrController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
