export class DialogData<T = any> {
  object: T;
  ask: string;
  title: string;

  constructor(object: T, ask: string, title: string) {
    this.object = object;
    this.ask = ask;
    this.title = title;
  }
}
