import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesEntity } from './entities/favorites.entity';
import { TracksService } from 'src/Track/track.service';
import { AlbumsService } from 'src/Album/album.service';
import { ArtistsService } from 'src/Artist/artist.service';
import { Artist } from 'src/Artist/interfaces/artist.interfase';
import { Album } from 'src/Album/interfaces/album.interfase';
import { Track } from 'src/Track/interfaces/track.interfase';

@Injectable()
export class FavoritesService {
  private favorites: FavoritesEntity = {
    artists: [],
    albums: [],
    tracks: [],
  };
  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
  ) {}

  findAll() {
    return {
      artists: this.favorites.artists
        .map((id) => this.artistsService.findById(id))
        .filter((a): a is Artist => a !== undefined),
      albums: this.favorites.albums
        .map((id) => this.albumsService.findById(id))
        .filter((a): a is Album => a !== undefined),
      tracks: this.favorites.tracks
        .map((id) => this.tracksService.findById(id))
        .filter((t): t is Track => t !== undefined),
    };
  }

  createTrack(id: string): void {
    const alreadyInFavs = this.favorites.tracks.includes(id);
    if (alreadyInFavs) {
      throw new ConflictException('Track already in favorites');
    }

    try {
      this.tracksService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.tracks.push(id);
  }

  createAlbum(id: string): void {
    const value = this.favorites.albums.includes(id);
    if (value) {
      throw new ConflictException('Album exist in favorites');
    }

    try {
      this.albumsService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.albums.push(id);
  }
  createArtist(id: string): void {
    const value = this.favorites.artists.includes(id);
    if (value) {
      throw new ConflictException('Artists exist in favorites');
    }

    try {
      this.artistsService.findOne(id);
    } catch (e) {
      throw new HttpException(
        'Track does not exist',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    this.favorites.artists.push(id);
  }

  removeTrack(id: string): void {
    const before = this.favorites.tracks.length;
    this.favorites.tracks = this.favorites.tracks.filter((u) => u !== id);
    if (this.favorites.tracks.length === before) {
      throw new NotFoundException('Track not found in favorites');
    }
  }
  removeAlbum(id: string): void {
    const before = this.favorites.albums.length;
    this.favorites.albums = this.favorites.albums.filter((u) => u !== id);
    if (this.favorites.albums.length === before) {
      throw new NotFoundException('Album not found in favorites');
    }
  }
  removeArtist(id: string): void {
    const before = this.favorites.artists.length;
    this.favorites.artists = this.favorites.artists.filter((u) => u !== id);
    if (this.favorites.artists.length === before) {
      throw new NotFoundException('Artists not found in favorites');
    }
  }

  removeArtistId(id: string): void {
    this.favorites.artists = this.favorites.artists.filter((x) => x !== id);
  }

  removeAlbumId(id: string): void {
    this.favorites.albums = this.favorites.albums.filter((x) => x !== id);
  }

  removeTrackId(id: string): void {
    this.favorites.tracks = this.favorites.tracks.filter((x) => x !== id);
  }
}
