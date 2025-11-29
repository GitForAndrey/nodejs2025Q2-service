import { Module } from '@nestjs/common';
import { UsersModule } from './User/user.module';
import { TracksModule } from './Track/track.module';

@Module({
  imports: [UsersModule, TracksModule],
})
export class AppModule {}
