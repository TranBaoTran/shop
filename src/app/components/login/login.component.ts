import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login, LoginResponse } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
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
