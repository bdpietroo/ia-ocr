import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LlmService } from './llm.service'; 
import { PrismaService } from './prisma.service';
import { DocumentService } from './document.service';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [AppService, LlmService, PrismaService, DocumentService],
})
export class AppModule {}
