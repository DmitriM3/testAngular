import {Model} from "./model";

export class Bus {
  id : number;
  licensePlate: string;
  numberOfSeats: number;
  model: Model;


  constructor(id: number, licensePlate: string, numberOfSeats: number, model: Model) {
    this.id = id;
    this.licensePlate = licensePlate;
    this.numberOfSeats = numberOfSeats;
    this.model = model;
  }
}
