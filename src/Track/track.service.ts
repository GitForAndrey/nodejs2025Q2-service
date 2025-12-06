import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Track } from 'src/generated/prisma/client';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        name: dto.name,
        duration: dto.duration,
        artistId: dto.artistId || null,
        albumId: dto.albumId || null,
      },
    });
  }

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany({
      include: {
        artist: true,
        album: true,  
      },
    });
  }

  async findById(id: string): Promise<Track | null> {
    return this.prisma.track.findUnique({
      where: { id },
    });
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        artist: true,
        album: true,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: {
          name: dto.name,
          duration: dto.duration,
          artistId: dto.artistId,
          albumId: dto.albumId,
        },
      });
    } catch (error) {
      throw new NotFoundException('Track not found');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Track not found');
    }
  }

  async nullArtistById(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async nullAlbumById(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
