import { Module } from '@nestjs/common'
import { OcrService } from './ocr.service'
import { OcrController } from './ocr.controller'
import { OcrApiClient } from './client/ocr-api-client'
import { OcrClient } from './client/ocr-api-client.abstract'

@Module({
  controllers: [OcrController],
  providers: [
    OcrService,
    {
      provide: OcrClient,
      useClass: OcrApiClient, 
    },
  ]
})
export class OcrModule {}
