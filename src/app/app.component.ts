import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomerOrdersComponent } from './components/customer-orders/customer-orders.component';
import { HeaderAppComponent } from './components/header-app/header-app.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomerOrdersComponent, HeaderAppComponent,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sales-date-prediction';
}
