import { Component, Output } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Output() isSideNavOpen = false;
  title = 'app';

  toggleSideNavParent($event){
    console.log($event);
    console.log('toggle side nav app component')
    this.isSideNavOpen = !this.isSideNavOpen;
  }
}
