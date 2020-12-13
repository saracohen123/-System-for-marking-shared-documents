import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/User';
import { LogInService } from '../services/log-in.service'
@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LogInComponent implements OnInit {

  constructor(public logInService: LogInService, public router: Router) { }
  user: User = new User("", "");
  userForm: FormGroup;
  ngOnInit(): void {
    this.logInService.OnResponseOK().subscribe(
      data => {
        sessionStorage.setItem("currentUser", this.userForm.value.UserID)
        this.router.navigate(["mainDocument"]);
      }
    )
    this.logInService.OnResponseErr().subscribe(
      data => console.log(data)
    )

    this.logInService.OnResponseUserNotExist().subscribe(
      data => {
        alert("משתמש לא קיים")
      }
    )

    this.userForm = new FormGroup({
      UserID: new FormControl('', [Validators.required, Validators.email]),
      UserName: new FormControl('', [Validators.required])
    })
  }

  onSubmit() {
    this.user = this.userForm.value;
    this.logInService.LogIn(this.user)
  }
  
  Register() {
    this.router.navigate(["register"]);
  }



}
