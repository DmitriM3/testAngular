import {Component, OnInit} from '@angular/core';
import {Person} from "../../domain/person";
import {PersonService} from "../person.service";

@Component({
  selector: 'person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css'],
})
export class PersonListComponent implements OnInit {

  persons: Person[] = []

  personSelected: Person | null = null;

  constructor(private personService: PersonService) {
  }

  ngOnInit(): void {
    this.personService.findAll().subscribe(list => {
      console.log("In subscribe")
      this.persons = list;
    });
    console.log("out subscribe")
  }

  selectPerson(person: Person | null) {
    this.personSelected = person;
  }

  example() {
    let a = 3, b = 2;
    let result = a + b; //5
    a = 7;
  }
}
