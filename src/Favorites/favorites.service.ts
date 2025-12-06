import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const [artists, albums, tracks] = await Promise.all([
      this.prisma.favoriteArtist.findMany({ include: { artist: true } }),
      this.prisma.favoriteAlbum.findMany({ include: { album: true } }),
      this.prisma.favoriteTrack.findMany({ include: { track: true } }),
    ]);

    return {
      artists: artists.map((f) => f.artist),
      albums: albums.map((f) => f.album),
      tracks: tracks.map((f) => f.track),
    };
  }

  async createTrack(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const exists = await this.prisma.favoriteTrack.findUnique({
      where: { trackId: id },
    });
    if (exists) {
      throw new ConflictException('Track already in favorites');
    }

    await this.prisma.favoriteTrack.create({
      data: { trackId: id },
    });
  }

  async createAlbum(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) {
      throw new HttpException(
        'Album does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const exists = await this.prisma.favoriteAlbum.findUnique({
      where: { albumId: id },
    });
    if (exists) {
      throw new ConflictException('Album already in favorites');
    }

    await this.prisma.favoriteAlbum.create({
      data: { albumId: id },
    });
  }

  async createArtist(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) {
      throw new HttpException(
        'Artist does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const exists = await this.prisma.favoriteArtist.findUnique({
      where: { artistId: id },
    });
    if (exists) {
      throw new ConflictException('Artist already in favorites');
    }

    await this.prisma.favoriteArtist.create({
      data: { artistId: id },
    });
  }

  async removeTrack(id: string): Promise<void> {
    const deleted = await this.prisma.favoriteTrack
      .delete({
        where: { trackId: id },
      })
      .catch(() => null);

    if (!deleted) {
      throw new NotFoundException('Track not found in favorites');
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const deleted = await this.prisma.favoriteAlbum
      .delete({
        where: { albumId: id },
      })
      .catch(() => null);

    if (!deleted) {
      throw new NotFoundException('Album not found in favorites');
    }
  }

  async removeArtist(id: string): Promise<void> {
    const deleted = await this.prisma.favoriteArtist
      .delete({
        where: { artistId: id },
      })
      .catch(() => null);

    if (!deleted) {
      throw new NotFoundException('Artist not found in favorites');
    }
  }
}
