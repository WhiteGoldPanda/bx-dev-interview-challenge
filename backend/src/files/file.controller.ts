import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileService } from './files.service';

const ALLOWED = (
  process.env.ALLOWED_MIME_TYPES || 'image/png,image/jpeg,application/pdf'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

//const MAX = Number(process.env.MAX_FILE_SIZE_BYTES || 5 * 1024 * 1024);

@Controller('files')
@UseGuards(AuthGuard('jwt'))
export class FileController {
  constructor(private files: FileService) {}

  @Get()
  async list(@Req() req: { user: { id: string } }) {
    const userId = req.user.id;
    return this.files.list(`${userId}/`);
  }

  @Post('upload-url')
  async uploadUrl(
    @Body('filename') filename: string,
    @Body('contentType') contentType: string,
    @Req() req: { user: { id: string } },
  ) {
    if (!filename || !contentType)
      throw new BadRequestException('filename & contentType required');
    if (ALLOWED.length && !ALLOWED.includes(contentType)) {
      throw new BadRequestException('Unsupported content type');
    }
    const userId = req.user.id;
    const key = `${userId}/${Date.now()}_${filename}`;
    const url = await this.files.presignUpload(
      key,
      contentType,
      Number(process.env.PRESIGN_EXPIRES_SECONDS || 300),
    );
    return { uploadURL: url, key };
  }

  @Get('download-url')
  async downloadUrl(
    @Query('key') key: string,
    @Req() req: { user: { id: string } },
  ) {
    if (!key) throw new BadRequestException('key required');
    const userId = req.user.id;
    if (!key.startsWith(`${userId}/`))
      throw new BadRequestException('Access denied');
    const url = await this.files.presignDownload(
      key,
      Number(process.env.PRESIGN_EXPIRES_SECONDS || 300),
    );
    return { downloadURL: url };
  }
}
