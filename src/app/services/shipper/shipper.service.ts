import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBack } from '../../interfaces/response-back';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {

  routeShippers:string = "https://localhost:7269/api/shipper/getallshippers";

  constructor(private http:HttpClient) { }

  getShippers():Observable<ResponseBack>{
    return this.http.get<ResponseBack>(this.routeShippers);
  }


}
