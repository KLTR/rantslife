import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import  {RouterModule, Routes } from '@angular/router'

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';


// AngularFireStuff
import {AngularFireModule} from 'angularfire2'
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import  {environment} from '../environments/environment.prod';

// Services
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { AuthGuard } from './authGuards/auth.guard'

// Angular Material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

// Flash messages
import {FlashMessagesModule} from 'angular2-flash-messages'
import {HttpClientModule} from '@angular/common/http'
// import 'hammerjs';
import { RecordComponent } from './components/record/record.component';
import { FileDropDirective } from './directives/file-drop.directive';
import * as firebase from 'firebase';
import { TrendingComponent } from './components/trending/trending.component';
import { LiveRecordComponent } from './components/live-record/live-record.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ContentComponent } from './components/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { RtcComponent } from './components/rtc/rtc.component';

import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';

const appRoutes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full',canActivate: [AuthGuard]},
  {path:'login', component:LoginComponent},  
  {path:'home', component:HomeComponent, canActivate: [AuthGuard]},  
  {path:'profile', component:UserProfileComponent, canActivate: [AuthGuard] },
  {path:'record', component:RecordComponent, canActivate: [AuthGuard]},
  
]

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    UserProfileComponent,
    RecordComponent,
    FileDropDirective,
    TrendingComponent,
    LiveRecordComponent,
    SidenavComponent,
    ContentComponent,
    LoginComponent,
    RtcComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),    
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    FlashMessagesModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
    
  ],
  providers: [FirebaseService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
