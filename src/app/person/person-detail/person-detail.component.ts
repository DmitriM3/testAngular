import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Person } from "../../domain/person";
import { PersonService } from "../../person/person.service";
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-person-detail',
  templateUrl: './person-detail.component.html',
  styleUrls: ['./person-detail.component.css']
})
export class PersonDetailComponent implements OnInit {
  formPerson: FormGroup = this.fb.group({
    id: [null, []],
    name: ['', [Validators.required, Validators.minLength(4)]],
    lastName: ['', [Validators.required, Validators.minLength(4)]],
    age: ['', [Validators.required, Validators.min(1), Validators.max(99)]]
  })
  loading: boolean = false;

  constructor(public route: ActivatedRoute,
    public fb: FormBuilder, public router: Router,
    private personService: PersonService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.loading = true;
      let paramId = param.get("id");
      if (paramId != null) {
        const id = parseInt(paramId);
        this.personService.findOne(id).subscribe(person => {
          this.buildForm(person);
          this.loading = false;
        },
          error => {
            this.loading = false;
            this.snackBar.open(error, "Error", { duration: 2000 });
            this.goToBack();
          })
      } else {
        this.buildForm(null);
        this.loading = false;
      }
    })
  }

  buildForm(person: Person | null) {
    if (person != null)
      this.formPerson.patchValue({
        id: person.id,
        name: person.firstName,
        lastName: person.lastName,
        age: person.age
      })
  }

  public get fc() {
    return this.formPerson.controls;
  }

  save() {
    const person = new Person(
      this.formPerson.get(["id"])?.value,
      this.formPerson.get(["name"])?.value,
      this.formPerson.get(["lastName"])?.value,
      +this.formPerson.get(["age"])?.value);
    if (person.id != null) {
      this.personService.update(person).subscribe(p => {
        this.snackBar.open("La persona se actualizó con exito", "Éxito", { duration: 2000 });
        this.goToBack();
      },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
        }
      )
    } else {
      this.personService.create(person).subscribe(p => {
        this.snackBar.open("La persona se creo con exito", "Éxito", { duration: 2000 });
        this.goToBack();
      },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
          console.log(error)
        }
      )
    }
  }

  goToBack() {
    this.router.navigate(['persons', 'list']);
  }

}
