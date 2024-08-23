import { Component, inject, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatIconModule} from '@angular/material/icon';
import { FloatLabelType, MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule,NgForm,ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { CustomerElement } from '../../interfaces/customer-element.interface';
import { DialogService } from '../../services/dialog.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { DialogData } from '../../interfaces/dialog-data';
import { OrderService } from '../../services/order/order.service';
import { ResponseBack } from '../../interfaces/response-back';

@Component({
  selector: 'app-customer-orders',
  standalone: true,
  imports: [MatTableModule, 
    MatPaginatorModule,
    ScrollingModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSortModule,
    MatIconModule,
    DatePipe,
    MatSelectModule],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.css'
})
export class CustomerOrdersComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly dialogService = inject(DialogService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly predictionService = inject(OrderService);

  displayedColumns: string[] = ['customerName', 'lastOrderDate', 'nextPredictedOrder', 'opcionUno', 'opcionDos'];
  dataSource = new MatTableDataSource<CustomerElement>();
  texto = ""

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formSearchNameCustomer = this.formBuilder.group({
    searchNameCustomer: ['', []]
  });

  options = this.formBuilder.group({
    hideRequired: [false],
    floatLabel: ['auto' as FloatLabelType]
  });

  get searchNameCustomer() {
    return this.formSearchNameCustomer.get('searchNameCustomer') as FormControl;
  }
  
  onKeyDown(event: KeyboardEvent) {
    const allowedKeys = /^[a-zA-Z\s]$/;
    if (event.key === 'Backspace') {
      this.texto = this.texto.slice(0,-1)
      if(this.searchNameCustomer.value.length === 0){
        this.texto = "";
        this.loadPredictions()
      }
    }else if(allowedKeys.test(event.key)){
      this.texto+=event.key
    } 
    else{
      event.preventDefault()
      return;
    }    
    const list:CustomerElement[] = this.dataSource.data.filter(str => str.customerName.toLowerCase().includes(this.texto.toLowerCase()))
    if (list.length !== 0){
      this.dataSource = new MatTableDataSource<CustomerElement>(list)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    console.log(list);
    
  }

  

  ngOnInit(): void {
    this.loadPredictions();
  }

  loadPredictions(): void {
    this.predictionService.getNextPrediction().subscribe({
      next:(data:ResponseBack) => {
        console.log(data);
        this.dataSource = new MatTableDataSource<CustomerElement>(data.$values);
      },
      error:(e) => {
        console.error(e);
      },complete:()=>{
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    }
    );
  }


  getFloatLabelValue(): FloatLabelType {
    return this.options.get('floatLabel')?.value || 'auto';
  }

  openDialog(isOrderDialog: boolean, idClient:string) {
    const dialogText = isOrderDialog ? 'Customer AHPOP-Orders' : 'Customer AHPOP-New Order';
    const dialogColor = isOrderDialog ? 'red' : 'green';
    const dialogData:DialogData = {
      color:dialogColor,
      text: dialogText,
      board: isOrderDialog,
      idClient: idClient
    }
    this.dialogService.openDialog(dialogData);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  
}
