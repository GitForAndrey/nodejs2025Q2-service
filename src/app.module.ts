import { Module } from '@nestjs/common';
import { UsersModule } from './User/user.module';
import { TracksModule } from './Track/track.module';
import { ArtistsModule } from './Artist/artist.module';
import { AlbumsModule } from './Album/album.module';
import { FavoritesModule } from './Favorites/favorites.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistsModule, AlbumsModule, FavoritesModule],
})
export class AppModule {}
