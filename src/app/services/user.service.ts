import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login, User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isUserLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginError = new EventEmitter<boolean>(false);
  private apiUrl = 'https://fakestoreapi.com/users';
  private apiLoginUrl = 'https://fakestoreapi.com/auth/login';

  constructor(private http: HttpClient, private router:Router) { }

  userSignUp(data : User){
    return this.http.post(this.apiUrl, data, {observe: 'response'}).subscribe((result) => {
      console.log(result);
      if(result){
        this.isUserLoggedIn.next(true);
        localStorage.setItem('user', JSON.stringify(result));
        this.router.navigate(['/']);
      }
    });
  }

  reloadUser(){
    if(localStorage.getItem('user')){
      this.isUserLoggedIn.next(true);
      this.router.navigate(['/']);
    }
  }

  userLogin(data : Login){
    return this.http.post(this.apiLoginUrl, data, {observe : 'response'}).subscribe((result) => {
      if(result){
        console.log(result);
        this.isLoginError.emit(false);
      }else{
        this.isLoginError.emit(true);
      }
    })
  }
}
