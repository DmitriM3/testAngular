import {Injectable} from '@angular/core';
import {Person} from "../domain/person";
import {Observable, of} from "rxjs";
import {first, mergeMap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class PersonService {

  constructor() {
  }

  public findAll(): Observable<Person[]> {
    return of(persons);
  }

  public findOne(id: number): Observable<Person | null> {
    return of(persons).pipe(mergeMap(p => p),
      first(person => person.id == id, null));
  }
}

export const persons: Person[] = [
  new Person(1, "Federico", "Difabio", 27),
  new Person(2, "Juan", "Difabio", 14),
  new Person(3, "Roberto", "Difabio", 21),
  new Person(4, "Ricardo", "Difabio", 17)
]
