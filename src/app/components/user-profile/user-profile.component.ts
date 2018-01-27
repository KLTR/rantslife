import { Podcast } from './../../models/podcast';
import { FirebaseService } from './../../services/firebase.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  user;
  podcasts: Podcast[];
  uid;
  constructor(
    public auth: AuthService,
    public firebaseService: FirebaseService) { }

  ngOnInit() {
   this.user =  this.auth.getCurrentUser();
   this.uid = this.user.uid;
   console.log(this.uid)
    this.firebaseService.getUserPodcasts(this.uid).subscribe(podcasts => {
     this.podcasts = podcasts;
   });
  }

}
