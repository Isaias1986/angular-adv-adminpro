import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {

  public formSubmitted = false;
  public registerForm:any;
  

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { 
    
    this.registerForm = this.fb.group({
      nombre: ['Isaias',Validators.required],
      email: ['test100@gmail.com',[Validators.required, Validators.email]],
      password: ['123456',Validators.required],
      password2: ['123456',Validators.required],
      terminos: [true,Validators.required]
  
    }, {
      validators: this.passwordIguales('password','password2')
    });

  }


  crearUsuario(){
    this.formSubmitted = true;
    console.log( this.registerForm.value );

    if(this.registerForm.invalid){
      return;
    }

    // realizar el Post

    this.usuarioService.crearUsuario( this.registerForm.value )
    .subscribe( resp => {
       // Navegar al Dashboard
       this.router.navigateByUrl('/');
    }, (err) => {
      Swal.fire('Error', err.error.msg,'error');
    });

  }


  campoNoValido(campo: string): boolean {
     return this.registerForm.get(campo).invalid && this.formSubmitted ? true : false;
  }


  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    return (pass1 !== pass2) && this.formSubmitted ? true : false;
  }


  passwordIguales(pass1Name: string, pass2Name: string){
    return (formGroup: FormGroup) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if(pass1Control?.value === pass2Control?.value){
        pass2Control?.setErrors(null);
      }else{
        pass2Control?.setErrors({ noEsIgual: true });
      }

    } 
  }

}
