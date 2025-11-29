export class TrackEntity {
  id: string; // uuid v4
  name: string;
  artistId: string; // refers to Artist
  albumId: string; // refers to Album
  duration: number; // integer numberof last update
}