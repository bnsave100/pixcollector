import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  code(code: string): Observable<any> {
    return this.http
      .get(`/api/v1/auth?code=${code}`)
      .pipe(map(res => res as any));
  }

  isAuthorized(): boolean {
    return !!localStorage.getItem('token');
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const authenticated = this.isAuthorized();
    if (!authenticated) {
      this.router.navigate(['/auth']);
    }
    return authenticated;
  }
}
