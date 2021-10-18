import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {Bus} from "../domain/bus";
import {Model} from "../domain/model";
import {Brand} from "../domain/brand";

@Injectable({
  providedIn: 'root'
})
export class BusService {

  private resourceBusUrl: string = environment.backendUrl + "buses";

  private resourceBrandUrl: string = environment.backendUrl + "brand";

  private resourceModelUrl: string = environment.backendUrl + "model";


  constructor(private http: HttpClient) {
  }

  public findAll(): Observable<Bus[]> {
    return this.http.get<Bus[]>(this.resourceBusUrl)
      .pipe(map(buses =>
        buses.map(b => {
          return new Bus(b.id, b.licensePlate, b.numberOfSeats,
            new Model(b.model.id,b.model.name,
              new Brand(b.model.brand.id, b.model.brand.name, b.model.brand.models)));
        })));
  }

  public findAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.resourceBrandUrl)
      .pipe(map(brand =>
        brand.map(b => {
          return new Brand(b.id, b.name, b.models)})));
  };

  public findAllModels(id: number): Observable<Model[]> {
    return this.http.get<Model[]>(this.resourceModelUrl + "/" + id)
      .pipe(map(model =>
        model.map(m => {
          return new Model(m.id, m.name, m.brand)})));
  };

  update(bus: Bus): Observable<any> {
    return this.http.put<any>(this.resourceBusUrl, bus).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("El colectivo no pudo ser actualizado.");
      }))
  }

  create(bus: Bus): Observable<any> {
    return this.http.post<any>(this.resourceBusUrl, bus).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("El colectivo no pudo ser creado.");
      }));
  }

  public delete(id: number): Observable<any> {
    return this.http.delete<any>(this.resourceBusUrl + "/" + id)
      .pipe(
        catchError(error => {
          return throwError("El colectivo contiene informacion asociada importante.");
        }));
  }


  findOneBus(id: number) {
    return this.http.get<Bus>(this.resourceBusUrl + "/" + id)
      .pipe(
        catchError(error => {
          console.log("Error")
          return throwError("El colectivo no existe.");
        }),
        map(b => new Bus(b.id, b.licensePlate, b.numberOfSeats,
          new Model(b.model.id,b.model.name,
            new Brand(b.model.brand.id, b.model.brand.name, b.model.brand.models)))
        ));
  }

  createBrand(id: number, name: string, models: [string]) {
    return new Brand(id, name, models);
  }

  createModel(id: number, name: string, brandSelected: Brand) {
    return new Model(id,name,brandSelected);
  }
}
