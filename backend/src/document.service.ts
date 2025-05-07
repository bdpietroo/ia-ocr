import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DocumentService {
  constructor(private readonly prisma: PrismaService) {}

  async saveDocument(
    filename: string,
    text: string,
    explanation: string,
    userEmail: string, // <-- email do usuário autenticado
  ) {
    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return this.prisma.document.create({
      data: {
        filename,
        text,
        explanation,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async getAllDocuments() {
    return this.prisma.document.findMany();
  }

  async getDocumentsByUserEmail(email: string) {
    return this.prisma.document.findMany({
      where: {
        user: {
          email: email,
        },
      },
    });
  }

  async getDocumentByIdAndEmail(id: string, email: string) {
    return this.prisma.document.findFirst({
      where: {
        id: Number(id),
        user: {
          email: email,
        },
      },
    });
  }
}