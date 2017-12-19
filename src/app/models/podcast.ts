import {User} from '../models/user';
import {Comment} from '../models/comment';
export interface Podcast {
  id?:string;
  user_id:string;
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
  hashtags?:string[];
  likes?:User[];
  comments?:Comment[];
  listeners?:User[];
  audio_id?:string;
  image_id?:string;
}
