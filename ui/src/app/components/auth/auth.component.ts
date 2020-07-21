import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StoreService } from '../../services/store.service';

enum State {
  auth, success, loading, error
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit, OnDestroy {
  public StateEnum = State;
  public state: State = State.auth;
  private code: string;
  private transitionInterval;

  constructor(
    private storeService: StoreService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.router.url.slice(0, 10) === '/auth?code') {
      this.state = State.loading;
      this.code = this.router.url.slice(11);
      this.authService.code(this.code).subscribe(user => {
        if (user.body.user) {
          this.state = State.success;
          this.storeService.setStore({user: user.body.user});
          localStorage.setItem('token', user.body.user.token);
          this.transitionInterval = setInterval(() => { this.router.navigate(['/stocks']); }, 3000);
        } else {
          // err
          this.state = State.error;
        }
      });
    } else if (this.router.url.slice(0, 11) === '/auth?error') {
      this.state = State.error;
      console.log('ERROR: ', this.router.url);
    } else if (this.authService.isAuthorized) {
      this.router.navigate(['/stocks']);
    }
  }

  ngOnDestroy() {
    clearInterval(this.transitionInterval);
  }

  public loginVk(): void {
    const AUTH_URL_AUTHORIZE = 'https://oauth.vk.com/authorize' +
      '?client_id=7372433' +
      '&display=popup' +
      '&redirect_uri=https://pixcollector.herokuapp.com/auth' +
      '&scope=photos,offline' +
      '&response_type=code' +
      '&v=5.120';
    window.open(AUTH_URL_AUTHORIZE, "_self")
  }

}
