import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';


declare const google: any;
const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 

 
}


logout(){
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(localStorage.getItem('token') as string);  
  localStorage.removeItem('token');
  google.accounts.id.revoke(decodedToken.email,() => {
    this.router.navigateByUrl('/login');
  });
}


validarToken(): Observable<boolean> {
  const token = localStorage.getItem('token') || '';

  return this.http.get(`${base_url}/login/renew`,{
    headers:{
      'x-token': token
    }
  }).pipe(
    tap((resp:any) => {
      localStorage.setItem('token', resp.token)
    }),
    map(resp => true),
    catchError( error => of(false))
  );
}


crearUsuario( formData: RegisterForm){
  return this.http.post(`${base_url}/usuarios`, formData)
                                                        .pipe(
                                                          tap((resp:any) => {
                                                            localStorage.setItem('token', resp.token)
                                                          })
                                                        );
}

login( formData: LoginForm){
  return this.http.post(`${base_url}/login`, formData)
                                                      .pipe(
                                                        tap((resp:any) => {
                                                          localStorage.setItem('token', resp.token)
                                                        })
                                                      );
}


loginGoogle( token: string){
  return this.http.post(`${ base_url }/login/google`, { token })
  .pipe(
      tap((resp:any) => {
        localStorage.setItem('token', resp.token)
      })
  )
}


}





















