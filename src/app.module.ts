import { Module } from '@nestjs/common';
import { UsersModule } from './User/user.module';
import { TracksModule } from './Track/track.module';
import { ArtistsModule } from './Artist/artist.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistsModule],
})
export class AppModule {}
