import { Component, OnInit, ViewChild,ElementRef } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FirebaseService} from '../../services/firebase.service';
import {Podcast} from '../../models/podcast';
import {AudioFile} from '../../models/audio_file';
import {ImageFile} from '../../models/image_file';
import * as _ from 'lodash';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  rForm: FormGroup;
  description:string = '';
  title:string;
  img:string;
  audio:File;
  date:string;
  hashtags:[string];
  titleAlert : string = "This field is required"
  formSubmitted : boolean = false;
  audioFileAcitve:boolean = true;

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

  }
  @ViewChild('progressbar, progressbarImage') div: ElementRef;
  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
  ) { 
    this.rForm = fb.group({
      'title':[null,Validators.compose([Validators.required, Validators.minLength(4), Validators.maxLength(40)])],
      'description':[null,Validators.compose([Validators.required, Validators.minLength(20), Validators.maxLength(100)])],
      'tags':[null,Validators.required],
      'validate' : ''
    })
  }


  ngOnInit() {
  }

// Functions



  addPodcast(podcast) {
    this.podcast.title = podcast.title;
    this.podcast.description = podcast.description;
    this.podcast.date = new Date();
    this.podcast.audio_file_url = this.currentAudioFile.url;
    if(this.currentImageFile){
    this.podcast.image_file_url = this.currentImageFile.url;
  }
    this.firebaseService.addPodcastToCollection(this.podcast).then(()=>{
      this.firebaseService.flashMessagesService.show('sharing is caring',  { cssClass: 'alert alert-success', timeout: 3000 }); 
      this.resetFormFields();
      this.currentAudioFile = null;
      this.currentImageFile = null;         
    },
  (err)=>{
    
  });
  }

  clearAll(){
    if(this.currentAudioFile){
    this.firebaseService.cancelFileUpload(this.currentAudioFile.name).then((res)=>{
      console.log(res);
      this.currentAudioFile = null;   
    });
    if(this.currentImageFile){
      this.firebaseService.cancelFileUpload(this.currentImageFile.name).then((res)=>{
        console.log(res);
        this.currentImageFile = null;   
      });
  }
  this.resetFormFields();
    }
  }



resetFormFields(){
  this.rForm.reset();
      if(this.div){
      this.div.nativeElement.style.width = 0;
    }
}





  changeAudioFileActive(bool){
    this.audioFileAcitve = bool;
  }
  
  dropzoneState($event: boolean){
    this.dropzoneActive = $event;
  }

  handleDrop(fileList: FileList){
    let filesIndex = _.range(fileList.length)

    _.each(filesIndex, (idx) => {
      // Create a new AudioFile Object with the File that the user uploaded.
      if(this.audioFileAcitve){
      this.currentAudioFile = new AudioFile(fileList[idx])
      this.firebaseService.pushUploadAudio(this.currentAudioFile);
      }
      else{
        this.currentImageFile = new ImageFile(fileList[idx])
        this.firebaseService.pushUploadImage(this.currentImageFile);
      }      
    })
  }


}

