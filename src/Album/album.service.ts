import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AlbumEntity } from './entities/album.entity';
import { Album } from './interfaces/album.interfase';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumsService {
  private albums: AlbumEntity[] = [];

  create(dto: CreateAlbumDto): Album {
    const album: AlbumEntity = {
      id: randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId,
    };
    this.albums.push(album);
    return album;
  }

  findAll(): Album[] {
    return this.albums;
  }
  findById(id: string): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }
  findOne(id: string): Album {
    const album = this.albums.find((u) => u.id === id);
    if (!album) {
      throw new NotFoundException('Artist not found');
    }

    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album {
    const album = this.albums.find((u) => u.id === id);
    if (!album) {
      throw new NotFoundException('Album not found');
    }

    Object.assign(album, dto);
    return album;
  }

  remove(id: string): void {
    const before = this.albums.length;
    this.albums = this.albums.filter((u) => u.id !== id);
    if (this.albums.length === before) {
      throw new NotFoundException('Album not found');
    }
  }

  nullArtistById(artistId: string): void {
    this.albums = this.albums.map((album) =>
      album.artistId === artistId ? { ...album, artistId: null } : album,
    );
  }
}
