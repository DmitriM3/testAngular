import {Bus} from "./bus";
import {Person} from "./person";
import {Observable} from "rxjs";

export class Trip{
  id: number;
  departure: string;
  destination: string;
  startDate: number;
  endDate: number;
  bus: Bus;
  passengers : Person[];


  constructor(id: number, departure: string, destination: string, startDate: number, endDate: number, bus: Bus, passengers: Person[]) {
    this.id = id;
    this.departure = departure;
    this.destination = destination;
    this.startDate = startDate;
    this.endDate = endDate;
    this.bus = bus;
    this.passengers = passengers;
  }
}
