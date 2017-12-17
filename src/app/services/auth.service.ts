import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

import * as firebase from'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import  {Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'
import { User } from '../models/user'
@Injectable()
export class AuthService {
user: Observable<User>;
currentUser: firebase.User;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public flashMessagesService: FlashMessagesService,
  ) { 
      // Get auth data, then get firestore user document // null
      this.user = this.afAuth.authState
      .switchMap(user => {
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null)
        } 
      })
 }

getCurrentUser(){
  return this.afAuth.auth.currentUser;
}

getAuthState(){
let currentUser = this.afAuth.auth.currentUser;
  
  if(currentUser){
    return true;
  }else{
    return false;
  }

}

 googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
   return this.oAuthLogin(provider);
  }
facebookLogin(){
  const provider = new firebase.auth.FacebookAuthProvider();
  return this.oAuthLogin(provider);
}
anonymousLogin(){
  const provider = new firebase.auth.EmailAuthProvider();
  return this.oAuthLogin(provider);
}

  private oAuthLogin(provider){
    return this.afAuth.auth.signInWithPopup(provider)
    .then((credential)=> {
      this.updateUserData(credential)
      this.router.navigate(['/home'])
    })
  }

  private updateUserData(credential){
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);
    const data: User = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
      accessToken: credential.credential.accessToken,
    } 
    if(!data.gender){
      data.gender = 'Unassigned'
    }
    this.flashMessagesService.show('You are now logged in ', { cssClass: 'alert alert-success', timeout: 3000 })
    
    return userRef.set(data)
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
      this.flashMessagesService.show('You are now logged out ', { cssClass: 'alert alert-success', timeout: 3000 })
      
        this.router.navigate(['/']);
    });
  }
}

