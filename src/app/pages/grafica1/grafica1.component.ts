import { Component } from '@angular/core';
import { ChartData,  ChartType} from 'chart.js';



@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component  {

  public labels1: string [] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public data1: ChartData<'doughnut'> = {
    labels: this.labels1,
    datasets: [
      { 
        data: [ 10, 50, 100 ],
        backgroundColor:['#6857E6','#009FEE','#F02059']
       }
    ]
  };
 

}
