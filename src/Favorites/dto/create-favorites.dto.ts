import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFavoritesDto {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[];
}