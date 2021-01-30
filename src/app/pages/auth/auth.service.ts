import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment} from '@env/environment';
import { UserResponse, User } from '@app/shared/models/user.interface';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';

const helper = new JwtHelperService();

@Injectable({ 
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) { 
    this.checkToken();
  }

  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }

  login(authData: User):Observable<UserResponse | void>{
    return this.http
    .post<UserResponse>(`${environment.API_URL}/auth/login`, authData)
    .pipe(
      map( (res: UserResponse) =>{
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.handlerError(err))
    );
  }
  logout():void{
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login'])
  }
  private checkToken(): void
  {
    const userToken = localStorage.getItem('token')
    const isExpired = helper.isTokenExpired(<string>userToken);
    
    if(isExpired){
      this.logout();
    }else{
      this.loggedIn.next(true);
    }
    //TODO userLogger = true;
  }

  private saveToken(token: string): void
  {
    localStorage.setItem('token',token);
  }

  private handlerError(err: { message: any; }): Observable<never>{
    let errorMessage = "Ha ocurrido un error enviando los datos";
    if(err){
      errorMessage = `Codigo de Error : ${err.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
