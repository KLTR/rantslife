import { Component, OnInit, ElementRef , Input} from '@angular/core';
import {AuthService} from '../../services/auth.service'
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
@Input()  isSideNavOpen;
  constructor(public auth: AuthService) { }

  ngOnInit() {
  }
  ngAfterViewInit() {

  }
  
}
