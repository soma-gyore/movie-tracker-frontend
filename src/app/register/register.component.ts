import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user';
import { ReCaptchaComponent } from 'angular2-recaptcha';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  userAlreadyExists: boolean;
  fatalError: boolean;

  constructor(private auth: AuthService, private router: Router) { }

  @ViewChild(ReCaptchaComponent) captcha: ReCaptchaComponent;

  sendRegisterRequest(): void {
    this.auth.register(this.user)
      .then((response) => {
        this.router.navigateByUrl('/login');
      })
      .catch((response) => {
        if (response.status == 409) {
          this.userAlreadyExists = true;
        } else {
          this.fatalError = true;
        }
      });
  }

  onRegister(): void {
    this.captcha.reset();
    this.captcha.execute();
  }

  onCaptchaResponse(): void {
    this.user.reCaptchaResponse = this.captcha.getResponse().toString();
    this.sendRegisterRequest();
  }

  ngOnInit() { }

}
