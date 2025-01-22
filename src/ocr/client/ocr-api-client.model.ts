export type OcrClientResponse = {
    ParsedResults: OcrClientParsedResult[]
    OCRExitCode: number
    IsErroredOnProcessing: boolean
    ErrorMessage: string
    ErrorDetails: string
    ProcessingTimeInMilliseconds: string
    SearchablePDFURL: string
}

export type OcrClientParsedResult = {
    TextOverlay: OcrClientTextOverlay
    TextOrientation: string
    FileParseExitCode: number
    ParsedText: string
    ErrorMessage: string
    ErrorDetails: string
}

export type OcrClientTextOverlay = {
    Lines: OcrClientTextLine[]
    HasOverlay: boolean
    Message: string
}

export type OcrClientTextLine = {
    LineText: string
    MaxHeight: number
    MinTop: number
    Words: OcrClientLineWord[]
}

export type OcrClientLineWord = {
    WordText: string
    Left: number
    Top: number
    Height: number
    Width: number
}
