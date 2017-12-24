import { Hashtag } from './../models/hashtag';
import { User } from './../models/user';
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

  // podcasts
  private podcastCollection: AngularFirestoreCollection<Podcast>;
  // observable for firestore collection
  private podcasts: Observable<Podcast[]>;
  private podcastDoc: AngularFirestoreDocument<Podcast>;

  // user
  private userCollection: AngularFirestoreCollection<User>
  private users: Observable<User[]>;


  // hastags
  private hashtagCollection: AngularFirestoreCollection<Hashtag>
  private hashtags: Observable<Hashtag[]>;

  private basePath:string = '/uploads';

  //! Constructor

  constructor( 
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public flashMessagesService: FlashMessagesService,
    public authService: AuthService

  )
  { 


// Podcasts
    this.podcastCollection = this.afs.collection('podcasts', ref => ref.orderBy('date', 'desc'));
    this.podcasts = this.podcastCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Podcast;
        data.id = a.payload.doc.id;
        return data;
      })
    })
// Users
    this.userCollection = this.afs.collection('users');
    this.users = this.userCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as User;
        data.uid = a.payload.doc.id;
        console.log(data.uid)
        return data;
      })
    })

    // Hashtags
    this.hashtagCollection = this.afs.collection('hashtags');
    this.hashtags = this.hashtagCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Hashtag;
        return data;
      })
    })

    
  } 
  //*End Constructor


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

  // addItem(item: Item){
  //   this.itemsCollection.add(item);
  // }

  // deleteItem(item: Item){
  //   this.itemDoc = this.afs.doc(`items/${item.id}`);
  //   this.itemDoc.delete();
  // }

  // updateItem(item: Item){
  // this.itemDoc = this.afs.doc(`items/${item.id}`);
  // this.itemDoc.update(item);
  // }
//  !Examples

//* Podcast Collection Managing (Firestore)
public getPodcastCollection(){
  return this.podcastCollection;
}

public getPodcasts(){
  this.podcasts = this.podcastCollection.snapshotChanges().map(changes => {
    return changes.map(a => {
      const data = a.payload.doc.data() as Podcast;
      data.id = a.payload.doc.id;
      return data;
    })
  })
  return this.podcasts;
}
public addPodcastToCollection(podcast: Podcast) : Promise<firebase.firestore.DocumentReference>{
  return this.podcastCollection.add(podcast);                      
}
public addPodcastToUserCollection(podcast: Podcast, uid) : Promise<firebase.firestore.DocumentReference>{
  return this.userCollection.doc(uid).collection('user_podcasts').add(podcast);
}


public addHashtags(hashtags){
  let tagToAdd
  hashtags.forEach(tag => {
    console.log(tag);
    this.hashtagCollection.ref
    .where("tag", "==",tag.toLowerCase())
    .get()
    .then(result => {
      let tagToAdd = {
        id: tag.toLowerCase(),
        tag: tag.toLowerCase(),
        count: 0
      }
      console.log(result.empty);
      if (result.empty) {
        console.log(tagToAdd);
        this.hashtagCollection.add(tagToAdd)
      } else {
        let ref = this.hashtagCollection.doc(tagToAdd.id);
        let count = ref["count"]+1;
        console.log(count);
        console.log(ref);
      }
    })
    .catch(error => {
      console.log("error aayo che", error);
    });
  });
  
}


//  Storage handlers
//* Files handling (Storage)
 public pushUploadAudio(upload: AudioFile){
   if(!this.authService.getAuthState){
     console.log('user is not logged in !');
     return;
   }
   let storageRef = firebase.storage().ref();
   let uid = this.authService.getCurrentUser().uid;
  //  the audio file will be uploaded to the id generated to the Podcast Document
  let uploadTask = storageRef.child(`user_content`).child(uid).child(upload.podcast_id).child(upload.file.name).put(upload.file);
  console.log(uploadTask);
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
      this.flashMessagesService.show('Audio was successfuly uploaded!',  { cssClass: 'alert alert-success', timeout: 1500 })
      
    }
  )
 }



 public pushUploadImage(upload: ImageFile){
  if(!this.authService.getAuthState){
    console.log('user is not logged in !');
    return;
  }
  let uid = this.authService.getCurrentUser().uid;  
  let storageRef = firebase.storage().ref();
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
     this.flashMessagesService.show('Image was successfuly uploaded!',  { cssClass: 'alert alert-success', timeout: 3000 })     
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
    
