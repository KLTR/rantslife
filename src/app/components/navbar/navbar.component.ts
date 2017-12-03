import { Component, OnInit, ViewChild,ElementRef, Output,EventEmitter } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {DOCUMENT} from "@angular/common";
import {FirebaseService} from '../../services/firebase.service';
import  {Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map'
import * as firebase from 'firebase/app';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @Output() updateSideNav : EventEmitter<any> = new EventEmitter<any>();
  //! Variables
  @ViewChild('') div: ElementRef;
  

  searchTerm: string = '';
  startAt = new Subject();
  endAt = new Subject();

  podcasts;
  timeInterval;
  startObserve = this.startAt.asObservable();
  endObserve = this.endAt.asObservable();



  //! Constructor
  constructor(
    private firebaseService: FirebaseService) { }




  //! Functions
  ngOnInit() {
    Observable.combineLatest(this.startObserve, this.endObserve).subscribe((value) => {
      this.firebaseService.search(value[0], value[1]).subscribe((podcasts) =>{
        this.podcasts = podcasts;
      })
    })    
  }

 search($event){
   if(this.searchTerm == ''){
     return;
   }
   console.log((this.timeInterval))
  if(this.timeInterval){
    clearTimeout(this.timeInterval)
  }

    this.timeInterval = setTimeout(()=>{
    let q = $event.target.value
    this.startAt.next(q);
    this.endAt.next(q + '\uf8ff');
   },1000)

 }

 toggleSideNav($event){
   console.log('toggleSideNav navbar');
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