import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Album } from 'src/generated/prisma/client';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        name: dto.name,
        year: dto.year,
        artistId: dto.artistId || null,
      },
    });
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany({
      include: {
        artist: true,  // включає дані про артиста
        tracks: true,  // включає треки альбому
      },
    });
  }

  async findById(id: string): Promise<Album | null> {
    return this.prisma.album.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: true,
        tracks: true,
      },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: {
          name: dto.name,
          year: dto.year,
          artistId: dto.artistId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Album not found');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Album not found');
    }
  }

  async nullArtistById(artistId: string): Promise<void> {
    await this.prisma.album.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }
}
