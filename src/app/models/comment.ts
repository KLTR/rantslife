import {User} from '../models/user';
 

export interface Comment{
    id?:string;
    user?:User;
    text?:String;
    date?:String;
    likes?:User[];
    comments?:Comment[]
}