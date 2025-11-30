import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TracksModule } from 'src/Track/track.module';
import { AlbumsModule } from 'src/Album/album.module';
import { ArtistsModule } from 'src/Artist/artist.module';

@Module({
  imports: [TracksModule, AlbumsModule, ArtistsModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}