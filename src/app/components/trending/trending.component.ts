import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {Podcast} from '../../models/podcast';
// Jquery
declare var jquery:any;
declare var $ :any;
@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css']
})
export class TrendingComponent implements OnInit {
  trendingPodcasts : Podcast[];

  constructor(
    private firebaseService: FirebaseService,
  ) 
 { }

  ngOnInit() {
    this.firebaseService.getPodcasts().subscribe(podcasts => {
      this.trendingPodcasts = podcasts;
      console.log(podcasts);
      let date = new Date()
    });
  }
hoverCard(id){
     $('#'+id).stop().animate({
        height: "toggle",
        opacity: "toggle"
      }, 300);
    }

}
