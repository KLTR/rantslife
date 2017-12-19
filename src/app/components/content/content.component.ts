import { Component, OnInit } from '@angular/core';
import {Podcast} from '../../models/podcast';
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
  isShown: boolean[] = [false,false,false,false,false];
  previousShown : number = 0;
  foundPodcasts;
  timeInterval;
  allPodcasts : Podcast[];
  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  isUser = false;

  startObserve = this.startAt.asObservable();
  endObserve = this.endAt.asObservable();

  lastKeypress: number = 0;
  constructor(
    public firebaseService: FirebaseService,
  ) {    this.firebaseService.getPodcasts().subscribe(podcasts => {
    this.allPodcasts = podcasts;
    console.log(this.allPodcasts);
    let date = new Date()
  }); }

  ngOnInit() {
    this.firebaseService.getPodcasts().subscribe(podcasts => {
      this.allPodcasts = podcasts;
      console.log(this.allPodcasts);
      let date = new Date()
    });

    Observable.combineLatest(this.startObserve, this.endObserve).subscribe((value) => {
      this.firebaseService.search(value[0], value[1]).subscribe((podcasts) =>{
        this.foundPodcasts = podcasts;
      })
    })    
  }

toggleDropDown(num){
  this.isShown[num] = !this.isShown[num];
}
search($event){

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


}
  

  
