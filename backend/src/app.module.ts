import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app/app.service';
import { AuthModule } from './auth/auth.module';
import { FileController } from './files/file.controller';
import { FileService } from './files/files.service';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [AppController, FileController],
  providers: [AppService, FileService],
})
export class AppModule {}
