/*
  THIS COMPONENT IS NOT USED AFTER ADDING VK AUTHORIZATION (MAY BE THE PROJECT STRUCTURE
  WILL BE CHANGED AND COMPONENT WILL BE USEFUL).
 */
import { Component, OnInit } from '@angular/core';
import { MdDialogRef} from '@angular/material';
import {AuthenticationService} from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  error = false;
  errorMessage: any = {};
  user = {remember: false};
  model: any = {};
  loading = false;
  registration = false;
  signin = true;
  returnUrl: string;

  constructor(private dialogRef: MdDialogRef<LoginComponent>,
              private authenticationService: AuthenticationService,
              private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('User: ', this.user);
    this.dialogRef.close();
  }

  login() {
    this.loading = true;
    console.log(this.model);
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.router.navigate(['/home'], { relativeTo: this.route });
          this.dialogRef.close();
          console.log(localStorage.getItem('currentUser'));
        },
        error => {
          console.log(localStorage.getItem('currentUser'));
          this.error = true;
          this.errorMessage = error;
          this.loading = false;
        });
  }


  register() {
    this.loading = true;
    this.model.passwordConfirm = this.model.password;
    console.log(this.model);
    this.authenticationService.create(this.model)
      .subscribe(
        data => {
          this.error = true;
          this.errorMessage = 'Registration Successful';
          this.registration = false;
          this.signin = true;
          this.loading = false;
        },
        error => {
          this.error = true;
          console.log(error.status);
          this.errorMessage = 'error ' + error.status + '(' + error.statusText + ')\n\t' + JSON.stringify(error.json());
          console.log(this.errorMessage);
          this.loading = false;
          // this.errorMessage = error;
        });
  }

}
