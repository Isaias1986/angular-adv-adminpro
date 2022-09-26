import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: any;
  public imgTemp: any;

  constructor(public modalImagenService:ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImagenService.carrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(
                          this.imagenSubir,
                          tipo,
                          id as string)
    .then(img => {
      Swal.fire('Imagen','Imagen cambiada correctamente','success');
      this.modalImagenService.nuevaImagen.emit(img);
      this.cerrarModal();
    }).catch(err => {
      Swal.fire('Error',err.error.msg,'error');
    });
      
  }

}
