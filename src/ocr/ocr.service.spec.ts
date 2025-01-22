import { Test, TestingModule } from '@nestjs/testing'
import { OcrService } from './ocr.service'
import { OcrClient } from './client/ocr-api-client.abstract'
import { OcrResult } from './models/ocr.model'
import { OcrClientResponse } from './client/ocr-api-client.model'
import { OcrOptions } from './client/ocr-api-client'

describe('OcrService', () => {
  let ocrService: OcrService
  let ocrClientMock: OcrClient<OcrClientResponse, OcrOptions>
  
  beforeEach(async () => {
    ocrClientMock = {
      processFileOcr: jest.fn(),
    } as OcrClient<OcrClientResponse, OcrOptions>

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OcrService,
        {
          provide: OcrClient,
          useValue: ocrClientMock,
        },
      ],
    }).compile()

    ocrService = module.get<OcrService>(OcrService)
  })

  const mockFile: Express.Multer.File = {
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

  const mockOcrResponse: OcrClientResponse = {
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

  const expectedFormattedOcrResult: OcrResult = {
    hasError: false,
    errorMessage: '',
    results: [
      {
        lineText: 'Invoice',
        maxHeight: 32,
        minTop: 253,
        words: [
          {
            text: 'Invoice',
            position: [273, 253, 140, 32]
          },
        ],
      },
    ],
  }

  it('should be defined', () => {
    expect(ocrService).toBeDefined()
  })

  describe('processFile', () => {
    it('should process a file and return a formatted OCR result', async () => {
      jest.spyOn(ocrClientMock, 'processFileOcr').mockResolvedValue(mockOcrResponse)

      const result = await ocrService.processFile(mockFile)

      expect(ocrClientMock.processFileOcr).toHaveBeenCalledWith(mockFile, { isOverlayRequired: true })
      expect(result).toEqual(expectedFormattedOcrResult)
    })

    it('should throw an error if the OCR client fails', async () => {
      jest.spyOn(ocrClientMock, 'processFileOcr').mockRejectedValue(new Error('OCR API Error'))

      await expect(ocrService.processFile(mockFile)).rejects.toThrow('OCR API Error')
      expect(ocrClientMock.processFileOcr).toHaveBeenCalledWith(mockFile, { isOverlayRequired: true })
    })
  })
})
