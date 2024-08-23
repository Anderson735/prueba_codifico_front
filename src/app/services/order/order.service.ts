import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerElement } from '../../interfaces/customer-element.interface';
import { ResponseBack } from '../../interfaces/response-back';
import { CreateOrder } from '../../interfaces/create-order.interface';

@Injectable({
  providedIn: 'root',
  
})
export class OrderService {

  routePrediction:string = "https://localhost:7269/api/orders/getnextpredictorders";
  routeOrdersClient:string = "https://localhost:7269/api/orders/getclientorders/";
  routeCreateOrders:string = "https://localhost:7269/api/orderdetails/addorder";
  constructor(private http:HttpClient) { }

  createOrder(order:CreateOrder):Observable<ResponseBack>{
    return this.http.post<ResponseBack>(
      this.routeCreateOrders,
      order
    )
  }

  getNextPrediction(): Observable<ResponseBack> {
    return this.http.get<ResponseBack>(this.routePrediction);
  }

  getOrdersClient(idClient:string): Observable<ResponseBack>{
    return this.http.get<ResponseBack>(
      this.routeOrdersClient + `${idClient}`
    )
  }
}
