import { Router } from '@angular/router';
import { Component, OnInit, ViewChild,ElementRef, Output,EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {DOCUMENT} from "@angular/common";
import {FirebaseService} from '../../services/firebase.service';
import {AuthService} from '../../services/auth.service';
import  {Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map'
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {Podcast} from '../../models/podcast';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() updateSideNav : EventEmitter<any> = new EventEmitter<any>();
  //! Variables
  @ViewChild('') div: ElementRef;
  

  podcasts;
  allPodcasts;
  timeInterval;

  searchterm: string;
  startAt = new Subject();
  endAt = new Subject();
  isUser = false;

  startObserve = this.startAt.asObservable();
  endObserve = this.endAt.asObservable();

  lastKeypress: number = 0;

  //! Constructor
  constructor(
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private router: Router) {
     }




  //! Functions
  ngOnInit() {

   Observable.combineLatest(this.startObserve, this.endObserve).subscribe((value) => {
      this.firebaseService.search(value[0], value[1]).subscribe((podcasts) =>{
        this.podcasts = podcasts;
      })
    })    
  }

 search($event){
   if($event.timeStamp - this.lastKeypress > 200){
    let q = $event.target.value
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.podcasts = this.allPodcasts;
    }
   }
   this.lastKeypress = $event.timeStamp;
 }
route(path){
  this.router.navigate(['/'+path]);
}
 toggleSideNav($event){
  this.updateSideNav.emit($event);
 }
}


  
// isLux: boolean = true;
 // changeTheme(){
  //   if(this.isLux){
  //     document.getElementById('theme').setAttribute('href','https://bootswatch.com/4/journal/bootstrap.min.css');      
  //   }
  //   if(!this.isLux){
  //     document.getElementById('theme').setAttribute('href','https://bootswatch.com/4/lux/bootstrap.min.css');      
  //   }
  //   this.isLux = !this.isLux;
  // }