export class AudioFile {
    $key?: string;
    id?:string;
    file:File;
    name?:string;
    url?:string;
    title?:string;
    description?:string
    creator?:string;
    img?:string;
    progress?:number;
    podcast_id?:string;
    progressString?:string;
    ref?:string;
    createdAt?: Date = new Date();
    constructor(file:File) {
      this.file = file;
    }
  }