import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {ActivatedRoute, Router} from "@angular/router";
import {TripService} from "../trip.service";
import {Person} from "../../domain/person";
import {Trip} from "../../domain/trip";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {persons} from "../../persons-administration/person.service";
import {Bus} from "../../domain/bus";



@Component({
  selector: 'app-trip-person-list',
  templateUrl: './trip-person-list.component.html',
  styleUrls: ['./trip-person-list.component.css']
})
export class TripPersonListComponent implements OnInit {
  @ViewChildren ('checkBox') checkBox:QueryList<any>;
  personsSelected: Person[] = [];
  persons: Person[] = [];
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName', 'age'];

  dataSource = new MatTableDataSource<Person>(this.persons);

  selection = new SelectionModel<Person>(true, []);
  formTrip: FormGroup = this.fb.group({
    id: [null, []],
    origen: [''],
    destination: [''],
    startDate: [''],
    endDate: [''],
    bus: [''],
    passengers: [''],
  });

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Person): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  checked = [];
  ps: Person[];
  getCheckbox(checkbox){
    console.log(this.selection.selected);
    this.checked = [];
    this.ps = [];
    const checked = this.checkBox.filter(checkbox => checkbox.checked);
    checked.forEach(data => {
      this.checked.push ({
        'checked' : data.checked,
        'value':  data.value
      })
    })

  }

  loading: boolean = false;
  constructor(public route: ActivatedRoute,
              public tripService: TripService,
              public fb: FormBuilder,
              public router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.loading = true;
      let paramId = param.get("id");
      if (paramId != null) {
        const id = parseInt(paramId);
        this.tripService.findTrip(id).subscribe(trip => {
            this.buildForm(trip);
            this.persons = this.formTrip.get('passengers')?.value;
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

  buildForm(trip: Trip | null) {
    if (trip != null)
      this.formTrip.patchValue({
        id: trip.id,
        origen: trip.departure,
        destination: trip.destination,
        startDate: trip.startDate,
        endDate: trip.endDate,
        bus: trip.bus,
        passengers: trip.passengers,
      })
  }

  goToBack() {
    this.router.navigate(['trips', 'list']);
  }

  generateRemainingPersons() {
    console.log(this.selection.selected)
    //Removing the element 2
    this.personsSelected = this.persons;
    this.personsSelected.forEach((element1,index1)=>{
      this.selection.selected.forEach((element2,index2)=>{
        if(element1==element2) delete this.personsSelected[index1];
      })
    });
    console.log(this.personsSelected)
  }

  save() {
    this.generateRemainingPersons();
    const trip = new Trip(
      this.formTrip.get(["id"])?.value,
      this.formTrip.get(["departure"])?.value,
      this.formTrip.get(["destination"])?.value,
      this.formTrip.get(["startDate"])?.value,
      this.formTrip.get(["endDate"])?.value,
      this.formTrip.get(["bus"])?.value,
      this.personsSelected,
    );
    if (trip.id != null) {
      this.tripService.update(trip).subscribe(p => {
          this.snackBar.open("Se actualizo con exito", "Éxito", { duration: 2000 });
          this.goToBack();
        },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
        }
      )
    }
    this.router.navigate(['trips', 'list']);
  }



}
