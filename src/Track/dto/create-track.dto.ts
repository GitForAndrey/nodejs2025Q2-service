import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsOptional()         // если это uuid, иначе можешь оставить просто IsString
  artistId?: string;
  @IsOptional()
  albumId?: string; 
  @IsNumber()
  @IsNotEmpty()
  duration: number; 
}