import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { catchError, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class EmployeeServices{
    url = 'http://localhost:3000/employee/'; 
    headers = new HttpHeaders().set('Content-Type','application/json');
    constructor(private httpClient: HttpClient){
    }

    list(): Observable<any>{
        return this.httpClient.get(this.url).pipe(
            catchError(this.handleError)
        );
    }

    getItem(id: any): Observable<any>{
        return this.httpClient.get(`${this.url}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    create(data:any){
        return this.httpClient.post<any>(this.url,data);
    }

    update(id: any, data:any): Observable <any>{
        return this.httpClient.put(`${this.url}/${id}`,data).pipe(
            catchError(this.handleError)
        );
    }

    delete(id:any): Observable<any>{
        return this.httpClient.delete(`${this.url}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    handleError(error: HttpErrorResponse){
        if(error.error instanceof ErrorEvent){
            console.error('An error occured:', error.error.message);
        }else{
            console.error(
                `Backend returned code ${error.status},`+ `body was: ${error.error}`
            );
        }
        return throwError(
            'Something bad happened; please try again later'
        );
    }

}