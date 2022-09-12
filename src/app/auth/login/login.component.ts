import { Component,  ViewChild, ElementRef, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


declare const google: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  implements OnInit{

   @ViewChild('googleBtn') googleBtn: ElementRef<HTMLInputElement> = {} as ElementRef;

  public formSubmitted = false;
  public loginForm:any;
  public auth2: any;

  constructor(private router:Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { 

  this.loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '',[Validators.required, Validators.email]],
    password: ['',Validators.required],
    remember: [false]
  });              

}

ngOnInit(): void {
  
}

ngAfterViewInit(): void {
    this.googleInit();
}

googleInit(){
  google.accounts.id.initialize({
    client_id: "415884655968-mp72bntcrekn6a95rdhi623me48acj9a.apps.googleusercontent.com",
    callback: (response:any) => this.handleCredentialResponse(response)
  });
  google.accounts.id.renderButton(
    this.googleBtn.nativeElement,
    { theme: "outline", size: "large" }  // customization attributes
  );
  
}

handleCredentialResponse(response: any) {
  this.usuarioService.loginGoogle(response.credential)
  .subscribe( resp => {
     this.router.navigateByUrl('/');
  },(err)=> {
    Swal.fire('Error',err.message,'error');
  })
}



  login(){
    this.usuarioService.login(this.loginForm.value)
    .subscribe( resp => {
    
      if(this.loginForm.get('remember').value){
        localStorage.setItem('email', this.loginForm.get('email').value);
      }else{
        localStorage.removeItem('email');
      }

      // Navegar al Dashboard
      this.router.navigateByUrl('/');

    }, (err) => {
        Swal.fire('Error',err.error.msg,'error');
    });
    
  }




}









