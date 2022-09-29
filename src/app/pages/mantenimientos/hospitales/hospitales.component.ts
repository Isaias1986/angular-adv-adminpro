import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hospital } from 'src/app/models/hospital.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';



@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  public imgSubs: Subscription;

  constructor(  private hospitalService: HospitalService,
                private modalImagenService: ModalImagenService,
                private busquedaService: BusquedasService,) { 
                  this.imgSubs = Subscription.EMPTY;
                }

  ngOnInit(): void {
    this.cargarHospitales();

   this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe( delay(200))
    .subscribe(img => this.cargarHospitales());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  cargarHospitales(){
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe( hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
    })
  }

  guardarCambios(hospital: Hospital){
    this.hospitalService.actualizarHospital(hospital._id as string, hospital.nombre)
    .subscribe(resp => {
      Swal.fire('Actualizado', hospital.nombre, 'success');
    });
  }

  eliminarHospital(hospital: Hospital){
    this.hospitalService.borrarHospital(hospital._id as string,)
    .subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Eliminado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert(){

    const { value } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    })


    if(value && value.trim().length > 0){
      this.hospitalService.crearHospital(value)
          .subscribe( (resp:any) => {            
            this.hospitales.push(resp.hospital);
            Swal.fire('Guardado', value, 'success')} );
    }

  }


  abrirModal(hospital:Hospital){
    this.modalImagenService.abrirModal('hospitales',hospital._id as string,hospital.img as string);
  }


  buscar( termino: string){
    if(termino.length === 0){
       this.cargarHospitales()
       return;
    }    

    this.busquedaService.buscar('hospitales',termino)
        .subscribe( resultados => {
          this.hospitales = resultados;
        });
  }

}
