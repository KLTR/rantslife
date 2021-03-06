import { Podcast } from './podcast';
export interface User{
    uid?:string;
    email?:string;
    photoURL?:string;
    avatar?:string;
    displayName?:string;
    favoriteColor?: string;
    gender?:string;
    accessToken?:string;
    podcasts?:Podcast[];
    date_joined?:string;
  }
  