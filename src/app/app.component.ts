import { Component, Output } from '@angular/core';
import {AuthService} from './services/auth.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() isSideNavOpen = false;
  title = 'app';

  constructor(public authService: AuthService){

  }
  toggleSideNavParent($event){

    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
