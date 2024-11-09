import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login, LoginResponse, User } from '../models/user.model';
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
    return this.http.post(this.apiUrl, data);
  }

  userLogIn(data : Login): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(this.apiLoginUrl, data);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getAll(): Observable<User[]>{
    return this.http.get<User[]>(this.apiUrl);
  }

  // Hàm lấy tất cả người dùng
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // Hàm lấy thông tin người dùng theo ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  deleteUser(id : number): Observable<User>{
    return this.http.delete<User>(`${this.apiUrl}/${id}`);
  }

  getUserData(id : number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`); 
  }

  updateUserData(user : User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user); 
  }
  
}
