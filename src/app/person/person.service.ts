import {Injectable} from '@angular/core';
import {Person} from "../domain/person";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable()
export class PersonService {

  private resourceUrl: string = environment.backendUrl + "persons";

  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Person[]> {
    return this.http.get<Person[]>(this.resourceUrl)
      .pipe(map(persons =>
        persons.map(p => new Person(p.id,
          p.firstName, p.lastName, p.age)
        )));
  }

  public findOne(id: number): Observable<Person | null> {
    return this.http.get<Person>(this.resourceUrl + "/" + id)
      .pipe(
        catchError(error => {
          console.log("Error")
          return throwError("La persona no existe.");
        }),
        map(p => new Person(p.id,
          p.firstName, p.lastName, p.age)
        ));
  }

  create(person: Person): Observable<any> {
    return this.http.post<any>(this.resourceUrl, person).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("La persona no pudo ser creada.");
      }));
  }

  update(person: Person): Observable<any> {
    return this.http.put<any>(this.resourceUrl, person).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("La persona no pudo ser actualizada.");
      }))
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(this.resourceUrl + "/" + id)
      .pipe(
        catchError(error => {
          return throwError("La persona contiene informacion asociada.");
        }));
  }
}
