import { Component, OnInit } from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {ActivatedRoute, Router} from "@angular/router";
import {TripService} from "../trip.service";
import {Person} from "../../domain/person";
import {Trip} from "../../domain/trip";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";



@Component({
  selector: 'app-trip-person-list',
  templateUrl: './trip-person-list.component.html',
  styleUrls: ['./trip-person-list.component.css']
})
export class TripPersonListComponent implements OnInit {
  personsSelected: Person[] = [];
  persons: Person[] = [];
  displayedColumns: string[] = ['select', 'id', 'firstName', 'lastName', 'age'];
  // dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource = new MatTableDataSource<Person>(this.persons);
  // selection = new SelectionModel<PeriodicElement>(true, []);
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

  selected: Person[] = [];

  click(person: any) {
    if(person != null) {
      this.selected.push(person);
    } else {
      let index = this.selected.indexOf(person);
      this.selected.splice(index, 1);
    }
  }



}
