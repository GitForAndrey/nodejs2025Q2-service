import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TrackEntity } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './interfaces/track.interfase';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  private tracks: TrackEntity[] = [];

  create(dto: CreateTrackDto): Track {
    const track: TrackEntity = {
      id: randomUUID(),
      name: dto.name,
      artistId: dto.artistId,
      albumId: dto.albumId,
      duration: dto.duration,
    };
    this.tracks.push(track);
    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }
  findById(id: string): Track | undefined {
    return this.tracks.find((a) => a.id === id);
  }
  findOne(id: string): Track {
    const track = this.tracks.find((u) => u.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  update(id: string, dto: UpdateTrackDto): Track {
    const track = this.tracks.find((u) => u.id === id);
    if (!track) {
      throw new NotFoundException('Track not found');
    }

    Object.assign(track, dto);
    return track;
  }

  remove(id: string): void {
    const before = this.tracks.length;
    this.tracks = this.tracks.filter((u) => u.id !== id);
    if (this.tracks.length === before) {
      throw new NotFoundException('Track not found');
    }
  }

  nullArtistById(artistId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.artistId === artistId ? { ...track, artistId: null } : track,
    );
  }

  nullAlbumById(albumId: string): void {
    this.tracks = this.tracks.map((track) =>
      track.albumId === albumId ? { ...track, albumId: null } : track,
    );
  }
}
