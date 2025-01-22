import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common'
import { OcrService } from './ocr.service'
import { FileInterceptor } from '@nestjs/platform-express'
import { OcrResult } from './models/ocr.model'

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('process')
  @UseInterceptors(FileInterceptor('file'))
  async processFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }), // 1MB file size limit for Free API
        new FileTypeValidator({ fileType: /(png|jpg|jpeg|pdf)$/ }),
      ],
    }),
  ) file: Express.Multer.File): Promise<OcrResult> {
    return await this.ocrService.processFile(file)
  }
}
