import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ArtistEntity } from './entities/artist.entity';
import { Artist } from './interfaces/artist.interfase';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistsService {
  private artists: ArtistEntity[] = [];

  create(dto: CreateArtistDto): Artist {
    const artist: ArtistEntity = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };
    this.artists.push(artist);
    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }
  findById(id: string): Artist | undefined {
    return this.artists.find((a) => a.id === id);
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((u) => u.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, dto: UpdateArtistDto): Artist {
    const artist = this.artists.find((u) => u.id === id);
    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    Object.assign(artist, dto);
    return artist;
  }

  remove(id: string): void {
    const before = this.artists.length;
    this.artists = this.artists.filter((u) => u.id !== id);
    if (this.artists.length === before) {
      throw new NotFoundException('Artist not found');
    }
  }
}
