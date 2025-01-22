export type OcrResult = {
    hasError: boolean
    errorMessage: string
    results: OcrParsedResult[]
}

export type OcrParsedResult = {
    lineText: string
    maxHeight: number
    minTop: number
    words: OcrParsedResultWord[]
}

export type OcrParsedResultWord = {
    text: string
    position: [number, number, number, number]
}
