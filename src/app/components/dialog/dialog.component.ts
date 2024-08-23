import { Component, inject, Inject, ViewChild } from '@angular/core';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { HeaderAppComponent } from '../header-app/header-app.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { OrderCustomer } from '../../interfaces/order-customer.interface';
import { FormBuilder, FormControl,  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DialogData } from '../../interfaces/dialog-data';
import { OrderService } from '../../services/order/order.service';
import { ResponseBack } from '../../interfaces/response-back';
import { ProductsService } from '../../services/products/products.service';
import { Product } from '../../interfaces/product';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employees } from '../../interfaces/employees.interface';
import { Shipper } from '../../interfaces/shipper.interface';
import { ShipperService } from '../../services/shipper/shipper.service';
import { forkJoin } from 'rxjs';
import { CreateOrder } from '../../interfaces/create-order.interface';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    HeaderAppComponent,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatSelectModule,
    MatSortModule,
    MatDatepickerModule,
    DatePipe
  ],
  providers:[provideNativeDateAdapter()],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductsService);
  private readonly employeeService = inject(EmployeeService);
  private readonly shipperService = inject(ShipperService);

  displayedColumns: string[] = ['orderid', 'requireddate', 'shippeddate', 'shipname', 'shipaddress', 'shipcity'];
  dataSource = new MatTableDataSource<OrderCustomer>();
  listProducts:Product[] = []
  listEmployees:Employees[] = []
  listShipper:Shipper[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  foods = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  formCustomer = this.formBuilder.group({
    employee: ['', Validators.required],
    shipper: ['', Validators.required],
    shipName: ['', Validators.required],
    shipAddress: ['', Validators.required],
    shipCity: ['', Validators.required],
    shipCountry: ['', Validators.required],
    orderDate: ['', Validators.required],
    requiredDate: ['', Validators.required],
    shippedDate: ['', Validators.required],
    freight: ['', Validators.required],
    product: ['', Validators.required],
    unitPrice: ['', Validators.required],
    quantity: ['', Validators.required],
    discount: ['', Validators.required]
  });

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  loadOrders(): void {
    this.orderService.getOrdersClient(this.data.idClient).subscribe({
      next:(data:ResponseBack) => {
        this.dataSource = new MatTableDataSource<OrderCustomer>(data.$values);
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

  loadDataForm():void{
    forkJoin([
      this.productService.getProducts(),
      this.employeeService.getEmployees(),
      this.shipperService.getShippers()
    ]).subscribe({
      next: ([productsData, employeesData, shippersData]) => {
        this.listProducts = productsData.$values;
        this.listEmployees = employeesData.$values;
        this.listShipper = shippersData.$values;
      },
      error: (e) => {
        console.error(e);
      }
    });
  }

  ngOnInit(){
    if(this.data.board){
      this.loadOrders()
    }else{
      this.loadDataForm()
    }
  }

  announceSortChange(sortState: Sort) {
    console.log(sortState);
    
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  createOrder():void{
    const order:CreateOrder = {
      EmpId:Number(this.employee.value),
      ShipperId:Number(this.shipper.value),
      ShipName:this.shipName.value,
      ShipAddress:this.shipAddress.value,
      ShipCity:this.shipCity.value,
      OrderDate:new Date(this.orderDate.value),
      RequiredDate:new Date(this.requiredDate.value),
      ShippedDate:new Date(this.shippedDate.value),
      Freight:Number(this.freight.value),
      ShipCountry: this.shipCountry.value,
      ProductId:Number(this.product.value),
      UnitPrice:Number(this.unitPrice.value),
      Qty:Number(this.quantity.value),
      Discount:Number(this.discount.value)
    }
    console.log(order)
    this.orderService.createOrder(order).subscribe({
      next:(data:ResponseBack) => {
        console.log(data.$values);
        
      },
      error:(e) => {
        console.error(e);
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  // Getters para los controles del formulario
  get employee() { return this.formCustomer.get('employee') as FormControl; }
  get shipper() { return this.formCustomer.get('shipper') as FormControl; }
  get shipName() { return this.formCustomer.get('shipName') as FormControl; }
  get shipAddress() { return this.formCustomer.get('shipAddress') as FormControl; }
  get shipCity() { return this.formCustomer.get('shipCity') as FormControl; }
  get shipCountry() { return this.formCustomer.get('shipCountry') as FormControl; }
  get orderDate() { return this.formCustomer.get('orderDate') as FormControl; }
  get requiredDate() { return this.formCustomer.get('requiredDate') as FormControl; }
  get shippedDate() { return this.formCustomer.get('shippedDate') as FormControl; }
  get freight() { return this.formCustomer.get('freight') as FormControl; }
  get product() { return this.formCustomer.get('product') as FormControl; }
  get unitPrice() { return this.formCustomer.get('unitPrice') as FormControl; }
  get quantity() { return this.formCustomer.get('quantity') as FormControl; }
  get discount() { return this.formCustomer.get('discount') as FormControl; }
}
