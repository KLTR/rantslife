import { Hashtag } from './../../models/hashtag';
import { element } from 'protractor';
import { User } from './../../models/user';
import { AuthService } from './../../services/auth.service';
import { Podcast } from './../../models/podcast';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import  {Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map'

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  @ViewChild('audio') audio;

  // html attributes  
  isShown: boolean[] = [false,false,false,false,false];

  // allPodcasts : Podcast[];
  allPodcasts : Podcast[];

// search
previousShown : number = 0;
foundPodcasts;
timeInterval;
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  isUser = false;
  startObserve = this.startAt.asObservable();
  endObserve = this.endAt.asObservable();
  lastKeypress: number = 0;
  popularHashtags: Hashtag[];
  isSearched: boolean = false;
  constructor(
    public firebaseService: FirebaseService,
    public authService: AuthService
  ) {

   }

  ngOnInit() {
    
    this.firebaseService.getPodcasts().subscribe(podcasts => {
      this.allPodcasts = podcasts;
      let date = new Date()
    });

    this.firebaseService.getHashtags().subscribe(hashtags =>{
      this.popularHashtags = hashtags;
    })
    
    // Search observables
    Observable.combineLatest(this.startObserve, this.endObserve).subscribe((value) => {
      this.firebaseService.search(value[0], value[1]).subscribe((podcasts) =>{
        this.foundPodcasts = podcasts;
      })
    });    
  }


closeSearch(){
  this.isSearched = false;
}
toggleDropDown(num){
  this.isShown[num] = !this.isShown[num];
}
search($event){
  this.isSearched = true;
  // 200 milliseconds between keydown
  if($event.timeStamp - this.lastKeypress > 200){
   let q = $event.target.value
   if (q != '') {
     this.startAt.next(q);
     this.endAt.next(q + "\uf8ff");
   }
   else {
     this.foundPodcasts = this.allPodcasts;
   }
  }
  this.lastKeypress = $event.timeStamp;
}

listen(podcast: Podcast){
  console.log(podcast);
  let user = this.authService.getCurrentUser()
  const data: User = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  }
  for(var i = 0; i < podcast.listeners.length; i++){
    if(data.uid == podcast.listeners[i].uid){
      return
    }
  }
  podcast.listeners.push(data);
  this.firebaseService.listenedToPodcast(podcast);
  return;
}

like(podcast :Podcast){
  let user = this.authService.getCurrentUser()
    const data: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    }
    // if no likes - add and update
    if(podcast.likes.length == 0){
      podcast.likes.push(data);
      this.firebaseService.like(podcast);
      this.firebaseService.addLikedPodcastToUserCollection(podcast);
      return;
    }
    // check if user already likes podcast.

for(var i = 0 ; i < podcast.likes.length; i++){
  if(data.uid == podcast.likes[i].uid){
    // if so , remove and update.
    console.log(podcast.likes[i]);
    podcast.likes.splice(i,1)
    this.firebaseService.like(podcast);

    this.firebaseService.removeLikedPodcastFromUserCollection(podcast);
    this.checkUserLikes(podcast);
    return;
  }
}
    // else push and update.
    podcast.likes.push(data);
    this.firebaseService.addLikedPodcastToUserCollection(podcast);
    this.firebaseService.like(podcast);

}

checkUserLikes(podcast){
  let fullHeart = 'fas fa-heart';
  let emptyHeart = 'far fa-heart'
  let user = this.authService.getCurrentUser();
  for(let i = 0 ; i < podcast.likes.length; i++){
    // if user liked return fullHeart
    if(podcast.likes[i].uid == user.uid){
      return fullHeart
    }
  }
  // else; return emptyHeart
  return emptyHeart
}

}
  

  
