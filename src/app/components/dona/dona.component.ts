import { Component, Input } from '@angular/core';
import { ChartData,  ChartType} from 'chart.js';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'Sin titulo';
  @Input('labels') doughnutChartLabels: string[] = [ 'Label-1', 'Label-2', 'Label-3' ];
  @Input('data') doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { 
        data: [ 350, 450, 100 ],
        backgroundColor:['#6857E6','#009FEE','#F02059']
       }
    ]
  };
  
  public doughnutChartType: ChartType = 'doughnut';
}
