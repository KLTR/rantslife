import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import  {Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap'
import { User } from '../models/user'
@Injectable()
export class AuthService {
user: Observable<User>;
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) { 
      
      this.user = this.afAuth.authState
      .switchMap(user => {
        if(user){
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null)
        }
      })
 }

 googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
   console.log(provider);
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
      console.log(credential)
      this.updateUserData(credential)
    })
  }

  private updateUserData(credential){
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${credential.user.uid}`);
    const data: User = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      photoURL: credential.user.photoURL,
      gender: credential.additionalUserInfo.profile.gender,
      accessToken: credential.credential.accessToken,
    }
    return userRef.set(data)
  }
  signOut() {
    this.afAuth.auth.signOut().then(() => {
        this.router.navigate(['/']);
    });
  }
}

