import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent implements OnInit{

  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userid');
    if (userId) {
      this.userService.getUserById(userId).subscribe((data: User) => {
        this.user = data;
      });
    } else {
      console.error('User ID not found in localStorage');
    }
  }

  onSave(Profile: User): void {
    const userId = localStorage.getItem('userid');
    const username = Profile.username;
    const email = Profile.email;
    const password = Profile.password;
    const address = Profile.address;
    const phone = Profile.phone;
    if (userId) {
      this.userService.getUserById(userId).subscribe((data: User) => {
        window.alert("Change Success");
      });
    } else {
      window.alert("Change Error !!!");
    }
  }

  updateUser(userData: any): void {
    if(window.confirm('Are you sure you want to edit this information ?')){
      this.userService.updateUser(userData).subscribe(data => {
        if (data && data.success) {
          window.alert("Change Success");
        } else {
          window.alert("Change Error !!!");
        }
      });
    }   
  }


}
