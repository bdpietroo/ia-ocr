import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class AppService {
   async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log(`Processando arquivo: ${file.originalname}`);

    try {
      // Realiza OCR no buffer do arquivo
      const result = await Tesseract.recognize(file.buffer, 'eng', {
        logger: (info) => console.log(info), // Log do progresso (opcional)
      });

      console.log('Texto extraído:', result.data.text);
      return result.data.text; // Retorna o texto extraído
    } catch (error) {
      console.error('Erro ao processar OCR:', error);
      throw new Error('Erro ao processar OCR');
    }
  }
}
