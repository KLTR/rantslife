import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http'
import  {RouterModule, Routes } from '@angular/router'

// components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AddItemComponent } from './components/add-item/add-item.component'
import { ItemsComponent } from './components/items/items.component'

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
// import {MatButtonModule, MatAutocompleteModule, MatSidenavModule, MatIconModule, MatCardModule, MatMenuModule, MatTableModule} from '@angular/material';

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

const appRoutes: Routes = [
  {path:'', component:HomeComponent},
  {path:'items', component:ItemsComponent},
  {path:'add-item', component:AddItemComponent , canActivate: [AuthGuard]},
  {path:'profile', component:UserProfileComponent },
  {path:'record', component:RecordComponent},
  
]

firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    ItemsComponent,
    AddItemComponent,
    UserProfileComponent,
    RecordComponent,
    FileDropDirective,
    TrendingComponent,
    LiveRecordComponent,
    SidenavComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase, 'angularfs'),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    FlashMessagesModule,
    RouterModule.forRoot(appRoutes),
    
  ],
  providers: [FirebaseService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
