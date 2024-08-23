import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBack } from '../../interfaces/response-back';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  ruta:string = "https://localhost:7269/api/employee/getemployees";
  constructor(private http:HttpClient) { }
 
  getEmployees():Observable<ResponseBack>{
    return this.http.get<ResponseBack>(this.ruta);
  }
  
}
