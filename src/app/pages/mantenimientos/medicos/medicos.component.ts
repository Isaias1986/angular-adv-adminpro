import { Component, OnDestroy, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  public imgSubs: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedasService) {
                this.imgSubs = Subscription.EMPTY;
               }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(200))
    .subscribe(img => this.cargarMedicos());
  }

  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe( resp => {
      this.cargando = false;
      this.medicos = resp;
    });

  }

  buscar(termino:string){
    if(termino.length === 0){
      this.cargarMedicos();
      return;
   }    

   this.busquedaService.buscar('medicos',termino)
       .subscribe( resultados => {
         this.medicos = resultados;
       });
 }
  


  abrirModal(medico:Medico){
    this.modalImagenService.abrirModal('medicos',medico._id as string,medico.img as string);
  }


  borrarMedico(medico:Medico){
    
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${medico.nombre}`,
      icon:'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo'
    }).then( (result) => {
      if(result.value){
        this.medicoService.borrarMedico(medico._id as string).subscribe( resp => {
          this.cargarMedicos();
          Swal.fire('Eliminado', medico.nombre, 'success');
        });

        
      }
    });
    
    
    
    
  }

}
