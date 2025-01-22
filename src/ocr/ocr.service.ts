import { Injectable } from '@nestjs/common'
import { OcrClient } from './client/ocr-api-client.abstract'
import { OcrResult } from './models/ocr.model'
import { OcrOptions } from './client/ocr-api-client'
import { OcrClientResponse } from './client/ocr-api-client.model'

@Injectable()
export class OcrService {
  constructor(private readonly ocrClientApi: OcrClient<OcrClientResponse, OcrOptions>) {}

  // Format OCR result to only get the necessary data for the frontend
  private static formatOcrResult(ocrResponse: OcrClientResponse): OcrResult {
    return {
      hasError: ocrResponse.IsErroredOnProcessing,
      errorMessage: ocrResponse.ParsedResults[0].ErrorMessage,
      results: ocrResponse.ParsedResults[0].TextOverlay.Lines.map(line => ({
        lineText: line.LineText,
        maxHeight: line.MaxHeight,
        minTop: line.MinTop,
        words: line.Words.map(word => ({
          text: word.WordText,
          position: [word.Left, word.Top, word.Width, word.Height],
        }))
      }))
    }
  }

  async processFile(file: Express.Multer.File): Promise<OcrResult> {
    const result = await this.ocrClientApi.processFileOcr(file, { isOverlayRequired: true })
    return OcrService.formatOcrResult(result)
  }
}
