import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth'
import  {Observable } from 'rxjs/Observable';
import  {Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import "rxjs/add/operator/switchMap";
import "rxjs/add/observable/zip";
import { Item } from '../models/item';
import { Podcast } from '../models/podcast';
import {AudioFile} from '../models/audio_file';
import {ImageFile} from '../models/image_file';
import {FlashMessagesService} from 'angular2-flash-messages';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { BehaviorSubject } from 'rxjs';
import {AuthService} from '../services/auth.service';
@Injectable()
export class FirebaseService {

  //! Variables

  itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  itemDoc: AngularFirestoreDocument<Item>;

  private podcastCollection: AngularFirestoreCollection<Podcast>;
  private podcasts: Observable<Podcast[]>;
  private podcastDoc: AngularFirestoreDocument<Podcast>;

  currentPodcast: Podcast = null;

  private basePath:string = '/uploads';


  //! Constructor

  constructor( 
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public flashMessagesService: FlashMessagesService,
    public authService: AuthService

  )
  { 



    this.podcastCollection = this.afs.collection('podcasts', ref => ref.orderBy('date', 'desc'));
    this.podcasts = this.podcastCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Podcast;
        data.id = a.payload.doc.id;
        return data;
      })
    })


  }
  //! Functions
  public login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  public logout() {
    this.afAuth.auth.signOut();
  }
  public search(start, end){
    // This makes a subscricbeable
    return this.afs.collection('podcasts', ref => ref.limit(10).orderBy('title').
    startAt(start).endAt(end)).valueChanges();
  }

  // Examples

  addItem(item: Item){
    this.itemsCollection.add(item);
  }

  deleteItem(item: Item){
    this.itemDoc = this.afs.doc(`items/${item.id}`);
    this.itemDoc.delete();
  }

  updateItem(item: Item){
  this.itemDoc = this.afs.doc(`items/${item.id}`);
  this.itemDoc.update(item);
  }
//  !Examples

//* Podcast Collection Managing (Firestore)
public getPodcastCollection(){
  return this.podcastCollection;
}

public getPodcasts(){
  return this.podcasts;
}
public addPodcastToCollection(podcast: Podcast) : Promise<firebase.firestore.DocumentReference>{
  return this.podcastCollection.add(podcast);                      
}



//* Files handling (Storage)
 public pushUploadAudio(upload: AudioFile){
   let storageRef = firebase.storage().ref();
   let uid = this.authService.getCurrentUser().uid;
   console.log(uid);
   
  //  the audio file will be uploaded to the id generated to the Podcast Document
  let uploadTask = storageRef.child(`user_content`).child(uid).child(upload.podcast_id).child(upload.file.name).put(upload.file);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot) =>{
      // upload in progress
      upload.progress = Math.floor((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes )* 100)
    },
    (error) =>{
      // upload failed
      this.flashMessagesService.show('Oh snap! please try again..',  { cssClass: 'alert alert-danger', timeout: 1500 })      
      console.log(error)
    },
    () => {
      // upload success
      upload.url = uploadTask.snapshot.downloadURL;
          //  upload.name is the name ref in firebase storage
      upload.name = uploadTask.snapshot.ref.name;
      upload.ref = uploadTask.snapshot.ref.fullPath;
      this.flashMessagesService.show('File was successfuly uploaded!',  { cssClass: 'alert alert-success', timeout: 1500 })
      
    }
  )
 }

 public pushUploadImage(upload: ImageFile){
  let uid = this.authService.getCurrentUser().uid;  
  let storageRef = firebase.storage().ref();
  console.log(uid);
  let uploadTask = storageRef.child(`user_content`).child(uid).child(upload.podcast_id).child(upload.file.name).put(upload.file);
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
   (snapshot) =>{
     // upload in progress
     upload.progress = Math.floor((uploadTask.snapshot.bytesTransferred / uploadTask.snapshot.totalBytes )* 100)
   },
   (error) =>{
     // upload failed
     this.flashMessagesService.show('Oh snap! please try again..',  { cssClass: 'alert alert-danger', timeout: 3000 })           
     console.log(error)
   },
   () => {
     // upload success     
     upload.url = uploadTask.snapshot.downloadURL;
    //  upload.name is the name ref in firebase storage
     upload.name = uploadTask.snapshot.ref.name;
     upload.ref = uploadTask.snapshot.ref.fullPath;
     console.log(upload.ref);
     this.flashMessagesService.show('File was successfuly uploaded!',  { cssClass: 'alert alert-success', timeout: 3000 })     
   })
}

public cancelFileUpload(url) : Promise<any>{
  let uid = this.authService.getCurrentUser().uid;    
  let storageRef = firebase.storage().ref();
  console.log()  
  let uploadTask = storageRef.child(`${url}`).delete()
  return uploadTask;
}

}
    
