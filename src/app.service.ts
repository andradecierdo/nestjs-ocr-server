import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getHealth(): string {
    return 'OCR Service Running!'
  }
}
