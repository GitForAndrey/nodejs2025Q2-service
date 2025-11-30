import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateFavoritesDto {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[];
}
