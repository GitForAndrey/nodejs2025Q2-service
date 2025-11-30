import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TracksModule } from 'src/Track/track.module';
import { AlbumsModule } from 'src/Album/album.module';
import { ArtistsModule } from 'src/Artist/artist.module';

@Module({
  imports: [ArtistsModule, AlbumsModule, TracksModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
