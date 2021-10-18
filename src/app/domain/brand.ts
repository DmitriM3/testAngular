export class Brand {
  id : number;
  name: string;
  models: [string];

  constructor(id: number, name: string, models: [string]) {
    this.id = id;
    this.name = name;
    this.models = models;
  }
}
