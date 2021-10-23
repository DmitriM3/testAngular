import {Injectable} from '@angular/core';
import {Bus} from "../domain/bus";
import {catchError, map} from "rxjs/operators";
import {Model} from "../domain/model";
import {Brand} from "../domain/brand";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Trip} from "../domain/trip";
import {Observable, throwError} from "rxjs";



@Injectable({
  providedIn: 'root'
})
export class TripService {

  private resourceTripUrl: string = environment.backendUrl + "trips";

  constructor(private http: HttpClient) {
  }

  findAll() {
    return this.http.get<Trip[]>(this.resourceTripUrl)
      .pipe(map(trip =>
        trip.map(t => {
          return new Trip(t.id, t.departure, t.destination, t.startDate, t.endDate, new Bus(t.bus.id, t.bus.licensePlate, t.bus.numberOfSeats,
            new Model(t.bus.model.id, t.bus.model.name,
              new Brand(t.bus.model.brand.id, t.bus.model.brand.name, t.bus.model.brand.models))),
            t.passengers);
        })));
  }

  findTrip(id: number) : Observable<Trip | null> {
    return this.http.get<Trip>(this.resourceTripUrl + "/" + id)
      .pipe(
        catchError(error => {
          console.log("Error")
          return throwError("El viaje no existe.");
        }),
        map(t => new Trip(t.id, t.departure, t.destination, t.startDate, t.endDate,
          new Bus(t.bus.id,t.bus.licensePlate, t.bus.numberOfSeats,
          new Model(t.bus.model.id,t.bus.model.name,
            new Brand(t.bus.model.brand.id, t.bus.model.brand.name, t.bus.model.brand.models))),
          t.passengers)));
  }

  update(trip: Trip) {
    return this.http.put<any>(this.resourceTripUrl, trip).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("El viaje no pudo ser actualizado.");
      }))
  }

  create(trip: Trip) {
    return this.http.post<any>(this.resourceTripUrl, trip).pipe(
      catchError(error => {
        console.log("Error")
        return throwError("El viaje no pudo ser creado.");
      }));
  }

}
