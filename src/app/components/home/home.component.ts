import { Component, OnInit, Output } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {FirebaseService} from '../../services/firebase.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  @Output() podcasts ;
  showRecord: boolean = false;
  constructor(private auth: AuthService,
  ){}

  ngOnInit() {
  }

}
