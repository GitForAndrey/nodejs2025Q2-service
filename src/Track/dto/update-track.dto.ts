import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

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