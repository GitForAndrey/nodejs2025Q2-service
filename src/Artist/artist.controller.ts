import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseUUIDPipe,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { ArtistsService } from './artist.service';
import { JwtAuthGuard } from 'src/Authorization/jwt-auth.guard';

@Controller('artist')
@UseGuards(JwtAuthGuard)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Post()
  async create(@Body() dto: CreateArtistDto) {
    return this.artistsService.create(dto);
  }

  @Get()
  async findAll() {
    return this.artistsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.artistsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateArtistDto,
  ) {
    return this.artistsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    await this.artistsService.remove(id);
  }
}
