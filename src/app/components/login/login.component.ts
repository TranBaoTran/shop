import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login, LoginResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(private userService : UserService, private router: Router) {}

  ngOnInit(): void {
    
  }

  logIn(logIn : Login): void{
    this.userService.userLogIn(logIn).subscribe((data : LoginResponse) => {
      if(data && data.token){
        window.alert("Login Success");
        localStorage.setItem('token', data.token);
        this.router.navigate(['']);
      }else{
        window.alert("Login Error");
      }
    })
  }
}
