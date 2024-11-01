import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Address, User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  address: Address = {
    geolocation: {
      lat: "-37.3159",
      long: "81.1496"
    },
    city: "kilcoole",
    street: "new road",
    number: 7682,
    zipcode: "12926-3874"
  };

  constructor(private userService : UserService, private router: Router) {}
  
  ngOnInit(): void {
    this.userService.reloadUser();
  }

  signUp(data: Omit<User, 'address'>):void{
    const userData: User = { ...data, address: this.address };
    this.userService.userSignUp(userData);
  }
}
