import { Module } from '@nestjs/common';
import { UsersModule } from './User/user.module';
import { TracksModule } from './Track/track.module';
import { ArtistsModule } from './Artist/artist.module';
import { AlbumsModule } from './Album/album.module';
import { FavoritesModule } from './Favorites/favorites.module';
import { PrismaModule } from 'prisma/prisma.module';
import { LoggingModule } from './Logging/logging.module';
import { AuthModule } from './Authorization/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    LoggingModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavoritesModule,
  ],
})
export class AppModule {}
