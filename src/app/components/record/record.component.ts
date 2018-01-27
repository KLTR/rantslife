import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {Podcast} from '../../models/podcast';
import {User} from '../../models/user';
import {Comment} from '../../models/comment';
import {AudioFile} from '../../models/audio_file';
import {ImageFile} from '../../models/image_file';
import * as _ from 'lodash';
import {AuthService} from '../../services/auth.service';
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  @Output() close = new EventEmitter();


  rForm: FormGroup;
  description:string = '';
  title:string;
  img:string;
  audio:File;
  date:string;
  hashtags:[string];
  titleAlert : string = "This field is required"
  formSubmitted : boolean = false;
  audioFileActive:boolean = true;
  tabsFlag:string = 'audio';

  currentAudioFile:AudioFile = null;
  currentImageFile:ImageFile = null;
  dropzoneActive:boolean = false;
  podcast: Podcast = {
    title: '',
    description: '',
    date: null,
    audio_file_url: '',
    image_file_url:'',
    hashtags: null,
    id:null,
    likes: null,
    comments: null,
    listeners : null,
    image_id: '',
    audio_id: '',
    user_id: '',
  }
  @ViewChild('progressbar, progressbarImage') div: ElementRef;
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private authService: AuthService
  ) { 
    this.rForm = fb.group({
      'title':[null,Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      'description':[null,Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(100)])],
      'tags':[null,Validators.required],
      'validate' : ''
    })
  }


  ngOnInit() {
    this.podcast.id = this.firebaseService.afs.createId();    
  }

// Functions
closeModal(){
  // $("#myModal").html("");
  // $("#myModal textarea").val("")

}

toggleTabs(str){
  this.tabsFlag = str;
}
onClose() {
  console.log('close');
  this.close.emit(null);
}
// Add podcat to podcast collection, userid's collection and add/update hashtags in collection
  addPodcast(podcast) {
    // creating id for podcast. 
    // files are stored in (user_content/{uid}/{pid}/{filename})
    
    this.podcast.creator = this.authService.getCurrentUser().displayName;
    this.podcast.user_id = this.authService.getCurrentUser().uid;
    this.podcast.title = podcast.title;
    this.podcast.description = podcast.description;
    this.podcast.date = new Date();
    this.podcast.likes = new Array<User>();
    this.podcast.likes[0] = this.authService.getCurrentUser();
    this.podcast.comments = new Array<Comment>();
    this.podcast.listeners = new Array<User>();
    this.podcast.hashtags = podcast.tags.split(" ");
    this.podcast.audio_file_url = this.currentAudioFile.url;
    // image file is not required.
    if(this.currentImageFile){
    this.podcast.image_file_url = this.currentImageFile.url;
  }
  // add podcast to global podcasts collection and to user's collection
    this.firebaseService.addPodcastToCollection(this.podcast).then(()=>{
      this.firebaseService.flashMessagesService.show('sharing is caring',  { cssClass: 'alert alert-success', timeout: 3000 });
      this.addPodcastToUserCollection(this.podcast); 
      this.firebaseService.addHashtags(this.podcast.hashtags);
    },
  (err)=>{
    console.log(err);
    this.clearAll();
  });


  }

  addPodcastToUserCollection(podcast :Podcast){
    console.log(podcast);
    console.log(this.podcast.user_id);
    this.firebaseService.addPodcastToUserCollection(podcast, this.podcast.user_id).then(()=>{
            // resetting form podcast Object and files
      this.resetFormFields();
      this.resetPodcast();
      this.onClose(); 
    },
    (err)=>{
      console.log(err);
      this.clearAll();
      this.onClose(); 

    });
  }

  clearAll(){
    if(this.currentAudioFile){
      // sends the url of the files to cancel
    this.firebaseService.cancelFileUpload(this.currentAudioFile.ref).then((res)=>{
      this.currentAudioFile = null;   
    });
    if(this.currentImageFile){      
      this.firebaseService.cancelFileUpload(this.currentImageFile.ref).then((res)=>{
        this.currentImageFile = null;   
      });
    }
    this.resetPodcast()    
  this.resetFormFields();
    // Make sure current files are nullified
   this.cancelFiledUpload()
  }
  
}

  resetPodcast(){
    this.podcast = {
      title: '',
      description: '',
      date: null,
      audio_file_url: '',
      image_file_url:'',
      hashtags: null,
      id:null,
      likes: null,
      comments: null,
      listeners : null,
      image_id: '',
      audio_id: '',
      user_id: '',
    }
  }


resetFormFields(){
  this.rForm.reset();
      if(this.div){
      this.div.nativeElement.style.width = 0;
    }
}

cancelFiledUpload(){
  if(this.currentAudioFile){
    // sends the url of the files to cancel
  this.firebaseService.cancelFileUpload(this.currentAudioFile.ref).then((res)=>{
    this.currentAudioFile = null;   
  });
  if(this.currentImageFile){      
    this.firebaseService.cancelFileUpload(this.currentImageFile.ref).then((res)=>{
      this.currentImageFile = null;   
    });
  }
  }  
}

resetFiles(){
 this.currentAudioFile = null;
 this.currentImageFile = null;
}


// File uploads
  changeAudioFileActive(bool){
    this.audioFileActive = bool;
  }
  
  dropzoneState($event: boolean){
    this.dropzoneActive = $event;
  }


  // Drop Upload


  handleDrop(file){
      if(this.audioFileActive){
      this.currentAudioFile = new AudioFile(file)
      this.currentAudioFile.podcast_id = this.podcast.id;
      this.firebaseService.pushUploadAudio(this.currentAudioFile);
      }
      else{
        this.currentImageFile = new ImageFile(file)
        this.currentImageFile.podcast_id = this.podcast.id;        
        this.firebaseService.pushUploadImage(this.currentImageFile);
      }      
    }
  

  // handleDrop(fileList: FileList){
  //   // let filesIndex = _.range(fileList.length)

  //   _.each(filesIndex, (idx) => {
  //     // Create a new AudioFile Object with the File that the user uploaded.
  //     if(this.audioFileActive){
  //     this.currentAudioFile = new AudioFile(fileList[0])
  //     console.log(this.currentAudioFile);
      
  //     this.currentAudioFile.podcast_id = this.podcast.id;
  //     this.firebaseService.pushUploadAudio(this.currentAudioFile);
  //     }
  //     else{
  //       this.currentImageFile = new ImageFile(fileList[0])
  //       this.currentImageFile.podcast_id = this.podcast.id;        
  //       console.log(this.currentImageFile);
        
  //       this.firebaseService.pushUploadImage(this.currentImageFile);
  //     }      
  //   })
  // }

  // Click Upload
  fileChangeEvent(event) {
    let file: File = event.target.files[0];
    if(this.audioFileActive){
      this.currentAudioFile = new AudioFile(file)
      this.currentAudioFile.podcast_id = this.podcast.id;              
      this.firebaseService.pushUploadAudio(this.currentAudioFile);
      }
      else{
        this.currentImageFile = new ImageFile(file)
        this.currentImageFile.podcast_id = this.podcast.id;                
        this.firebaseService.pushUploadImage(this.currentImageFile);
      } 
  }


}

