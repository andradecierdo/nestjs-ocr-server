export abstract class OcrClient<R, O> {
    abstract processFileOcr(file: Express.Multer.File, options: O): Promise<R>
}
