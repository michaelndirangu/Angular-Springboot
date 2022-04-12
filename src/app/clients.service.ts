import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { environment } from 'src/environments/environment';
import { Clients } from './Interfaces/Clients';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {


  apiServerUrl = environment.apiBaseUrl

  constructor(private http: HttpClient) { }

  public getClients(): Observable<Clients[]> {
    return this.http.get<Clients[]>(`${this.apiServerUrl}/clients`);
  }

  public addClient(client: Clients): Observable<Clients> {
    return this.http.post<Clients>(`${this.apiServerUrl}/saveclient`, client);
  }

  public updateClient(data: any, id: number): Observable<Clients> {
    return this.http.put<Clients>(`${this.apiServerUrl}/update/${id}`, data);
  }

  public deleteClient(id: number) {
    return this.http.delete<any>(`${this.apiServerUrl}/deleteclient/${id}`)
  }

  // public updateResident(data: any, id: number) {
  //   return this.http.put<any>(`${this.apiServerUrl}/api/update` + id, data);
  // }

  // public deleteClients(id: number) {
  //   return this.http.delete<any>(`${this.apiServerUrl}/api/delete/` + id);
  // }





  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.log("Client side error", errorResponse.error);
    } else {
      console.log("server side error", errorResponse);
    }
    return throwError('There is a problem in the service')
  }
}
