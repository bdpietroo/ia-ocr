import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as readline from 'readline';

@Injectable()
export class LlmService {
  private readonly apiUrl = 'http://localhost:11434/api/generate';

  async getContextualExplanation(prompt: string): Promise<string> {
    try {
      console.log('Enviando requisição para LLaMA:', {
        url: this.apiUrl,
        model: 'llama3',
        prompt,
      });

      const response = await axios.post(
        this.apiUrl,
        {
          model: 'llama3',
          prompt,
          stream: true, // Garante que o streaming esteja ativado
        },
        {
          responseType: 'stream', // Isso é ESSENCIAL para funcionar
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      let completeResponse = '';

      const rl = readline.createInterface({
        input: response.data,
        crlfDelay: Infinity,
      });

      for await (const line of rl) {
        if (line.trim() === '') continue;
        const parsed = JSON.parse(line);
        if (parsed.response) {
          completeResponse += parsed.response;
        }
        if (parsed.done) break;
      }

      return completeResponse.trim();

    } catch (error) {
      console.error('Erro ao consumir a API do LLaMA:', error.message);
      throw new HttpException(
        'Erro ao obter explicação da IA.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}