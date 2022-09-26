import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup<any>;
  public usuario: Usuario;
  public imagenSubir: any;
  public imgTemp: any;

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) { 
    

    this.usuario = usuarioService.usuario;            

                this.perfilForm = fb.group({
                nombre: [this.usuario.nombre, Validators.required],
                email:[this.usuario.email, [Validators.required, Validators.email]]
    });

  }

  ngOnInit(): void {
    
  }


  actualizarPerfil(){
    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe( resp => {
        const {nombre, email} = this.perfilForm.value
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado','Cambios fueron guardados','success');
      }, (err) => {
        Swal.fire('Error',err.error.msg,'error');
      });
  }




  cambiarImagen(event:any){
    this.imagenSubir = event.target.files[0];

    if(!event.target.files[0]) {
      this.imgTemp = null;
      return; 
    }

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onloadend = () =>{
      this.imgTemp = reader.result;
    }
  }

  subirImagen(){
    this.fileUploadService.actualizarFoto(
                          this.imagenSubir,
                          'usuarios',
                          this.usuario.uid as string)
    .then(img => {
      this.usuario.img = img;
      Swal.fire('Imagen','Imagen cambiada correctamente','success');
    }).catch(err => {
      Swal.fire('Error',err.error.msg,'error');
    });
      
  }



}// fin de la clase
