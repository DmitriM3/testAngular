import {Brand} from "./brand";

export class Model {
  id : number;
  name: string;
  brand: Brand;

  constructor(id: number, name: string, brand: Brand) {
    this.id = id;
    this.name = name;
    this.brand = brand;
  }


}
