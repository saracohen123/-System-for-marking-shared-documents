import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RegisterUserService } from '../services/register-user.service'
import { Router } from '@angular/router';
import { User } from '../models/User';

@Component({
  selector: 'app-userform',
  templateUrl: './userform.component.html',
  styleUrls: ['./userform.component.css']
})
export class UserformComponent implements OnInit {
  userForm: FormGroup
  constructor(private userRegisterService: RegisterUserService, public router: Router) {
  }
  user: User = new User("", "");
  ngOnInit(): void {
    this.userForm = new FormGroup(
      {
        UserID: new FormControl('', [Validators.required, Validators.email]),
        UserName: new FormControl('', [Validators.required])
      }
    )

    this.userRegisterService.onResponseOK().subscribe(
      succ => {
        console.log("succ")
        sessionStorage.setItem("currentUser", this.userForm.value.UserID)
        this.router.navigate(["mainDocument"]);
      }
    )

    this.userRegisterService.onResponseMistakeDetails().subscribe(
      data => alert("משתמש קיים במערכת ")
    )
  }

  onSubmit() {
    this.user = this.userForm.value;
    this.userRegisterService.Register(this.user);
  }

}
