import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()
  artistId?: string;
  @IsOptional()
  albumId?: string;
  @IsNumber()
  @IsNotEmpty()
  duration: number;
}
