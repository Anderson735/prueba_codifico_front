import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseBack } from '../../interfaces/response-back';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  routeProducts:string = "https://localhost:7269/api/product/getproducts";

  constructor(private http:HttpClient) { }

  getProducts():Observable<ResponseBack>{
    return this.http.get<ResponseBack>(this.routeProducts);
  }

}
