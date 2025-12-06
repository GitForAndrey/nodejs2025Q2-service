import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from 'src/generated/prisma/client';
import { PrismaService } from 'prisma/prisma.service';
@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany({
      include: {
        albums: true,  // включає альбоми артиста
        tracks: true,  // включає треки артиста
      },
    });
  }

  async findById(id: string): Promise<Artist | null> {
    return this.prisma.artist.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        tracks: true,
      },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: {
          name: dto.name,
          grammy: dto.grammy,
        },
      });
    } catch (error) {
      throw new NotFoundException('Artist not found');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Artist not found');
    }
  }
}
