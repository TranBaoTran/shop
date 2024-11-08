//import { Component } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [],
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

}
