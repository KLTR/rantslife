export interface Podcast {
  id?:string;
  file?:string;
  name?:string;
  url?:string;
  title?:string;
  description?:string;
  creator?:string;
  img?:string;
  date?:Date;
  audio_file_url?:string;
  image_file_url?:string;
  hashtags?:[string];
}
