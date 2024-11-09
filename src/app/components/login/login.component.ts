import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login, LoginResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  login : Login = {
    username : '',
    password : ''
  }

  constructor(private userService : UserService, private router: Router) {}

  ngOnInit(): void {
    
  }

  logInUser(): void{
    this.userService.userLogIn(this.login).subscribe((data : LoginResponse) => {
      if(data && data.token){
        window.alert("Login Success");
        const decodedToken = jwtDecode<any>(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userid', decodedToken.sub);
        this.router.navigate(['']);
      }else{
        window.alert("Login Error");
      }
    })
  }
}
