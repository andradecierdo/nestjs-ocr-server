import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import axios, { AxiosResponse } from 'axios'
import { OcrClient } from './ocr-api-client.abstract'
import { OcrClientResponse } from './ocr-api-client.model'

export type OcrOptions = {
  isOverlayRequired: boolean // If set to true, returns the coordinates of the bounding boxes for each word
  language?: 'eng' | 'chs' | 'cht' | 'fre' | 'ger' | 'kor' | 'ita' | 'jpn' // sample language options (not complete) 
  scale?: boolean // If set to true, the api improves the OCR result
}

@Injectable()
export class OcrApiClient implements OcrClient<OcrClientResponse, OcrOptions> {
    private readonly ocrApiUrl = process.env.OCR_API_URL
    private readonly apiKey = process.env.OCR_API_KEY

    private static setPostRequestForm(file: Express.Multer.File, options: OcrOptions): FormData {
      const formData = new FormData()

      const base64File = file.buffer.toString('base64')
      formData.append('base64Image', `data:${file.mimetype};base64,${base64File}`)
      formData.append('isOverlayRequired', options.isOverlayRequired.toString())
      if (options.language) {
        formData.append('language', options.language)
      }
      if (options.scale) {
        formData.append('scale', 'true')
      }

      return formData
    }

    private async postRequest(formData: FormData): Promise<AxiosResponse> {
      try {
        return await axios.post<OcrClientResponse, AxiosResponse>(this.ocrApiUrl, formData, {
          headers: {
            apikey: this.apiKey,
          },
        })
      } catch(e) {
        throw new HttpException('Error processing the OCR request', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

    async processFileOcr(file: Express.Multer.File, options: OcrOptions): Promise<OcrClientResponse> {
      const formData = OcrApiClient.setPostRequestForm(file, options)
      const response = await this.postRequest(formData)

      if (response.data.IsErroredOnProcessing) {
        throw new HttpException(response.data.ErrorMessage, HttpStatus.BAD_REQUEST)
      }

      return response.data
    }
}
