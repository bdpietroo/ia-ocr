import {
  Controller, HttpCode, HttpStatus, Get, Post, UploadedFile, UseInterceptors, UseGuards, Request, Param, Res,
 } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { LlmService } from './llm.service'; 
import { DocumentService } from './document.service';
import { AuthGuard } from '@nestjs/passport';
import * as puppeteer from 'puppeteer';
import { Response } from 'express';


@Controller('api')
export class AppController {
 constructor(
   private readonly appService: AppService,
   private readonly llmService: LlmService, 
   private readonly documentService: DocumentService,
 ) {}

 @Post('upload')
 @HttpCode(HttpStatus.OK)
 @UseGuards(AuthGuard('jwt'))
 @UseInterceptors(FileInterceptor('file'))
 async uploadFile(
   @UploadedFile() file: Express.Multer.File,
   @Request() req: any,
 ): Promise<{ text: string; explanation: string }> {
   try {
    const user = req.user; // O usuário autenticado será extraído do token JWT
    console.log(`Usuário autenticado: ${user.email}`);

     // Captura o nome do arquivo
     const filename = file.originalname;
     console.log(`Nome do arquivo: ${filename}`);
       
     // Extrai o texto da imagem usando OCR
     console.log('Iniciando upload do arquivo...')
     const rawText = await this.appService.uploadFile(file);

     // Limpo e formata o texto extraído
     const cleanedText = this.cleanText(rawText);

     // Cria um prompt para a IA com base no texto extraído
     const prompt = `Resumo simplificado para o cliente: escreva de forma clara e natural, como se estivesse explicando para uma pessoa comum. Destaque o código do cliente (se houver), o valor total da fatura, a data de vencimento, o período de cobrança dos serviços e as principais formas de pagamento. Inclua também avisos importantes, como juros e multa em caso de atraso. Utilize sempre o portugues e a moeda real do Brasil, se fatura estiver em outra lingua ou em outra moeda, converta tudo para o portugues e real. Resumo técnico dos valores cobrados: liste detalhadamente os valores dos serviços cobrados (TV, internet, telefone, serviços à la carte etc.), incluindo subtotais, totais e datas de referência, caso disponíveis. "${cleanedText}"`;

     // Obtém a explicação contextual da IA
     const explanation = await this.llmService.getContextualExplanation(prompt);
     console.log('Explicação gerada pela IA:', explanation);

     // Salva os resultados no banco de dados
     await this.documentService.saveDocument(filename, cleanedText, explanation, user.email);
     console.log('Texto e explicação salvos no banco de dados.');

     // Retorna o texto extraído e a explicação gerada pela IA
     return { text: cleanedText, explanation };
   } catch (error) {
     console.error('Erro ao processar a requisição:', error);
     throw new Error('Erro ao obter a explicação da IA');
   }
 }

   // Função para limpar e formatar o texto extraído
   private cleanText(text: string): string {
     return text
       .replace(/[\r\n]+/g, ' ') // Remove quebras de linha
       .replace(/["]+/g, '') // Remove aspas extras
       .replace(/[+]+/g, '') // Remove sinais de "+"
       .replace(/\s{2,}/g, ' ') // Substitui múltiplos espaços por um único espaço
       .trim(); // Remove espaços extras no início e no final
   
 }

@Get('me/documents')
@UseGuards(AuthGuard('jwt'))
async getMyDocuments(@Request() req: any) {
  const user = req.user;
  const documents = await this.documentService.getDocumentsByUserEmail(user.email);
  return documents;
}


@Get('download/:id')
@UseGuards(AuthGuard('jwt'))
async downloadFatura(@Param('id') id: string, @Res() res: Response, @Request() req: any) {
  const user = req.user;
  const document = await this.documentService.getDocumentByIdAndEmail(id, user.email);

  if (!document) {
    return res.status(404).send('Fatura não encontrada.');
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const html = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { text-align: center; color: #2c3e50; }
        .page { page-break-after: always; margin-bottom: 20px; }
        .last-page { page-break-after: auto; }
        .section { margin-bottom: 20px; }
        .box { padding: 15px; background: #f4f4f4; border-left: 5px solid #3498db; }
        .explanation { background: #e8f4fc; border-left: 5px solid #2980b9; }
        small { display: block; margin-top: 10px; color: #888; }
      </style>
    </head>
    <body>
      <!-- Primeira página - Texto Extraído -->
      <div class="page">
        <h1>${document.filename}</h1>
        <small>Criado em: ${new Date(document.createdAt).toLocaleString('pt-BR')}</small>

        <div class="section">
          <h2>Texto Extraído</h2>
          <div class="box">${document.text.replace(/\n/g, '<br>')}</div>
        </div>
      </div>

      <!-- Segunda página - Explicação da IA -->
      <div class="page last-page">
        <h1>${document.filename}</h1>
        <small>Criado em: ${new Date(document.createdAt).toLocaleString('pt-BR')}</small>

        <div class="section">
          <h2>Explicação da IA</h2>
          <div class="box explanation">${document.explanation.replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${document.filename.replace(/\.[^/.]+$/, '')}.pdf"`,
  });

  res.send(pdfBuffer);
}

}


