import { OcrApiClient, OcrOptions } from './ocr-api-client'
import { HttpException, HttpStatus } from '@nestjs/common'
import axios from 'axios'
import { OcrClientResponse } from './ocr-api-client.model'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

require('dotenv').config()

describe('OcrApiClient', () => {
  let ocrApiClient: OcrApiClient

  beforeEach(() => {
    ocrApiClient = new OcrApiClient()
  })

  const mockTestFile: Express.Multer.File = {
    buffer: Buffer.from('test'),
    originalname: 'test.png',
    mimetype: 'image/png',
    size: 1000,
    encoding: 'Base64',
    fieldname: 'file',
    stream: null,
    destination: '',
    filename: '',
    path: '',
  }

  const mockOcrOptions: OcrOptions = {
    isOverlayRequired: true,
    language: 'eng',
    scale: true,
  }

  const mockOcrClientResponse: OcrClientResponse = {
    ParsedResults: [
      {
        TextOverlay: {
          Lines: [
            {
              LineText: 'Invoice',
              Words: [
                  {
                      WordText: 'Invoice',
                      Left: 273,
                      Top: 253,
                      Height: 32,
                      Width: 140
                  },
              ],
              MaxHeight: 32,
              MinTop: 253
          },
          ],
          HasOverlay: false,
          Message: 'Total lines: 0',
        },
        TextOrientation: '0',
        FileParseExitCode: 1,
        ParsedText: 'Invoice',
        ErrorMessage: '',
        ErrorDetails: '',
      },
    ],
    OCRExitCode: 1,
    IsErroredOnProcessing: false,
    ErrorMessage: '',
    ErrorDetails: '',
    ProcessingTimeInMilliseconds: '100',
    SearchablePDFURL: '',
  }

  it('should process the file OCR successfully', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: mockOcrClientResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    })

    const result = await ocrApiClient.processFileOcr(mockTestFile, mockOcrOptions)

    expect(result).toEqual(mockOcrClientResponse)
    expect(mockedAxios.post).toHaveBeenCalledWith(
      process.env.OCR_API_URL,
      expect.any(FormData),
      {
        headers: {
          apikey: process.env.OCR_API_KEY,
        },
      }
    )
  })

  it('should throw an error if the OCR API returns an error response', async () => {
    const errorMessage = 'Invalid File'
    const errorResponse: OcrClientResponse = {
      ParsedResults: [],
      OCRExitCode: 1,
      IsErroredOnProcessing: true,
      ErrorMessage: errorMessage,
      ErrorDetails: 'Invalid File Format',
      ProcessingTimeInMilliseconds: '0',
      SearchablePDFURL: '',
    }

    mockedAxios.post.mockResolvedValueOnce({
      data: errorResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    })

    await expect(ocrApiClient.processFileOcr(mockTestFile, mockOcrOptions)).rejects.toThrow(
      new HttpException(errorMessage, HttpStatus.BAD_REQUEST),
    )
  })

  it('should throw an internal server error if OCR API HTTP request fails', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

    await expect(ocrApiClient.processFileOcr(mockTestFile, mockOcrOptions)).rejects.toThrow(
      new HttpException('Error processing the OCR request', HttpStatus.INTERNAL_SERVER_ERROR),
    )

    expect(mockedAxios.post).toHaveBeenCalled()
  })
})
