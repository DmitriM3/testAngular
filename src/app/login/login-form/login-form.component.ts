import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../security/service/authentication.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  loading: boolean = false;

  constructor(public fb: FormBuilder,
              public authService: AuthenticationService,
              public router: Router,
              public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn())
      this.router.navigate(['home']);
    this.loading = false;
  }

  logIn() {
    this.loading = true;
    this.authService.login(
      this.loginForm?.value.username,
      this.loginForm?.value.password
    ).subscribe(token => {
        console.log("Logged in!");
        this.router.navigate(['home'])
      },
      error => {
        this.snackBar.open(error, "Error", {duration: 2000});
        this.loading = false;
      })
  }

  public get fc() {
    return this.loginForm.controls;
  }

}
