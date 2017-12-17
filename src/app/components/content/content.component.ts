import { Component, OnInit } from '@angular/core';
import {Podcast} from '../../models/podcast';
import {FirebaseService} from '../../services/firebase.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  isShown = false;
  podcasts : Podcast[];
  constructor(
    public firebaseService: FirebaseService,
  ) { }

  ngOnInit() {
    this.firebaseService.getPodcasts().subscribe(podcasts => {
      this.podcasts = podcasts;
      console.log(podcasts);
      let date = new Date()
    });
  }

toggleDropDown(){
  this.isShown = !this.isShown;
}

}
