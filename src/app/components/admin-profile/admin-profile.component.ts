import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit{

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

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const storedUserId = localStorage.getItem('userid');
    const userId = storedUserId ? Number(storedUserId) : null;
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (data: User) => {
          if (data) {
            this.user = data;
          }
        },
        error: (error) => {
          window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
          console.error('Error:', error);
        },
        complete: () => {
          console.log('getUserById request completed.');
        },
      });
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  updateUserInfo(): void{
    if(window.confirm('Are you sure you want to edit this information ?')){
      this.userService.updateUserData(this.user).subscribe({
        next: (data: User) => {
          if (data) {
            this.user = data;
          }
        },
        error: (error) => {
          window.alert(`An error occurred: ${error.message || 'Unknown error'}`);
          console.error('Error:', error);
        },
        complete: () => {
          console.log('updateUserData request completed.');
          window.alert("Change Success");
        },
      });
    }   
  }

}
