import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  user : User = {
    address: {
      geolocation: {
        lat: "-37.3159",
        long: "81.1496"
      },
      city: "kilcoole",
      street: "new road",
      number: 7682,
      zipcode: "12926-3874"
    },
    id: 0,
    email: '',
    username: '',
    password: '',
    name: {
      firstname: '',
      lastname: ''
    },
    phone: ''
  };

  constructor(private userService : UserService) {}
  
  ngOnInit(): void {
    
  }

  signUpUser(): void{
    this.userService.userSignUp(this.user).subscribe(data => {
      if(data){
        window.alert('Sign up successfully. Please log in.');
      }else{
        window.alert('Sign up error.');
      }
    });
  }
}
