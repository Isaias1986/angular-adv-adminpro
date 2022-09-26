import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';


declare const google: any;
const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario = new Usuario('','');

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { 

 
}


get token():string {
    return localStorage.getItem('token')||'';
}

get uid():string {
 return this.usuario.uid || '';
}

get headers(){
  return {
    headers:{
      'x-token':this.token
    }
  }
}


logout(){
  const helper = new JwtHelperService();
  const decodedToken = helper.decodeToken(this.token);  
  if(decodedToken.email){
    google.accounts.id.revoke(decodedToken.email,() => {
      this.router.navigateByUrl('/login');
    });
  }else{
      this.router.navigateByUrl('/login');
  }
  localStorage.removeItem('token');
}


validarToken(): Observable<boolean> {

  return this.http.get(`${base_url}/login/renew`,{
    headers:{
      'x-token': this.token
    }
  }).pipe(
    map((resp:any) => {
      this.usuario = new Usuario(
        resp.usuario.nombre,
        resp.usuario.email,
        '',
        resp.usuario.img ? resp.usuario.img : '',
        resp.usuario.google,
        resp.usuario.role,
        resp.usuario.uid);
      localStorage.setItem('token', resp.token)
      return true;
    }),
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


actualizarPerfil( data: {email: string, nombre: string, role: string} ){

  data = {
    ... data,
    role: this.usuario.role as string
  } 

  return this.http.put(`${base_url}/usuarios/${this.uid}`,data,this.headers);
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



cargarUsuarios(desde: number = 0){
  const url = `${base_url}/usuarios?desde=${ desde }`;
  return this.http.get<CargarUsuario>( url, this.headers)
        .pipe(           
          map(resp =>{  
            const usuarios = resp.usuarios.map(
                            user => new Usuario(
                              user.nombre,
                              user.email,
                              '', 
                              user.img, 
                              user.google, 
                              user.role, 
                              user.uid));               
                    return {
                      total: resp.total,
                      usuarios
                    };
          })
        );
}



eliminarUsuario( usuario: Usuario){
  const url = `${base_url}/usuarios/${usuario.uid}`;
  return this.http.delete( url, this.headers);
}



guardarUsuario( usuario: Usuario){ 
  return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario,this.headers);
}


}





















