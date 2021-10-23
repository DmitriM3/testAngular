import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Trip} from "../../domain/trip";
import {TripService} from "../trip.service";
import {BusService} from "../../bus/bus.service";
import {Bus} from "../../domain/bus";
import {MatTableDataSource} from "@angular/material/table";
import {SelectionModel} from "@angular/cdk/collections";
import {Person} from "../../domain/person";
import {PersonService} from "../../person/person.service";
import {Model} from "../../domain/model";

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  formTrip: FormGroup = this.fb.group({
    id: [null, []],
    departure: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    bus: ['', [Validators.required]],
    passengers: [''],
  })

  buses: Bus[] = [];
  // busDisplayedColumns: string[] = ['marca', 'modelo', 'patente', 'numberofSeats'];
  // busDataSource = new MatTableDataSource<Bus>(this.buses);
  // busSelection = new SelectionModel<Bus>(false, []);

  allPersons: Person[] = [];
  personsOnList: Person[] = [];
  personasEnElViaje: Person[] = [];
  personsOnTripNewValue: Person[] = [];
  personDisplayedColumns: string[] = ['nombre', 'apellido'];
  personDataSource = new MatTableDataSource<Person>(this.allPersons);
  personsSelection = new SelectionModel<Person>(true, []);

  loading: boolean = false;
  newBusEdit: Bus;

  constructor(public route: ActivatedRoute,
              public tripService: TripService,
              public busService: BusService,
              public personService: PersonService,
              public fb: FormBuilder,
              public router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(param => {
      this.loading = true;
      let paramId = param.get("id");
      this.findAllBuses();
      this.findAllPersons();
      if (paramId != null) {
        const id = parseInt(paramId);
        this.tripService.findTrip(id).subscribe(trip => {
            this.buildForm(trip);
            this.loading = false;
          },
          error => {
            this.loading = false;
            this.snackBar.open(error, "Error", {duration: 2000});
            this.goToBack();
          })
      } else {
        this.buildForm(null);
        this.loading = false;
      }
    });
  }

  findAllBuses() {
    this.busService.findAll().subscribe(list => {
      this.buses = list;
      this.loading = false;
    });
  }
  findAllPersons() {
    this.personService.findAll().subscribe(list => {
      this.allPersons = list;
      this.loading = false;
    });
  }

  buildForm(trip: Trip | null) {
    if (trip != null) {
      const startDate = new Date(trip.startDate * 1000);
      const endDate = new Date(trip.endDate * 1000);
      this.formTrip.patchValue({
        id: trip.id,
        departure: trip.departure,
        destination: trip.destination,
        startDate: startDate,
        endDate: endDate,
        bus: trip.bus,
        passengers: trip.passengers,
      });
      this.personasEnElViaje = this.formTrip.get('passengers')?.value;
    }
    this.personsOnList = this.allPersons;
  }

  public get fc() {
    return this.formTrip.controls;
  }

  generateTripPersons() {
    console.log(this.personsSelection.selected)
    this.personsOnTripNewValue = this.personasEnElViaje;
    this.personsSelection.selected.forEach((element1,index1)=>{
      this.personasEnElViaje.forEach((element2, index2)=>{
        if(element1!=element2) this.personsSelection.selected.push(element2);
      })
    });
    console.log(this.personsSelection.selected);
    this.personsOnTripNewValue = this.personsSelection.selected;
  }

  generateNewListTripPersons(){
    if ( this.formTrip.get(["id"])?.value != null ){
      this.generateTripPersons();
    }
    if ( (this.formTrip.get(["id"])?.value == null) && (this.personsSelection.selected == null) ){
      this.personsOnTripNewValue = [];
    }
    if ( (this.formTrip.get(["id"])?.value == null) && (this.personsSelection.selected != null) ){
      this.personsOnTripNewValue = this.personsSelection.selected;
    }
  }

  save() {
    this.generateNewListTripPersons();
    if (this.newBusEdit == null){
      this.newBusEdit = this.formTrip.get(['bus'])?.value;
    }
    const trip = new Trip(
      this.formTrip.get(["id"])?.value,
      this.formTrip.get(["departure"])?.value,
      this.formTrip.get(["destination"])?.value,
      this.formTrip.get(["startDate"])?.value.getTime() / 1000,
      this.formTrip.get(["endDate"])?.value.getTime() / 1000,
      this.newBusEdit, this.personsOnTripNewValue);
    if (this.personsOnTripNewValue.length > this.newBusEdit.numberOfSeats){
      console.log("La cantidad de asientos es menor a la cantidad de pasajeros");
      this.snackBar.open("La cantidad de asientos es menor a la cantidad de pasajeros totales", "Error", { duration: 3000 });
      this.returnToEdit(trip);
    }
    if (this.personsOnTripNewValue.length <= this.newBusEdit.numberOfSeats) {
      if (trip.id != null) {
        this.tripService.update(trip).subscribe(p => {
            console.log("Se actualizo");
            this.snackBar.open("El viaje se actualizo con exito", "Éxito", {duration: 2000});
            this.goToBack();
          },
          error => {
            this.snackBar.open(error, "Error", {duration: 2000});
          }
        )
      } else {
        this.tripService.create(trip).subscribe(p => {
            console.log("Se creo");
            this.snackBar.open("El viaje se creo con exito", "Éxito", {duration: 2000});
            this.goToBack();
          },
          error => {
            this.snackBar.open(error, "Error", {duration: 2000});
            console.log(error)
          }
        )
      }
    }
  }

  goToBack() {
    this.router.navigate(['trips', 'list']);
  }

  returnToEdit(t: Trip | null) {
    if (t == null)
      this.router.navigate(['trips', 'list']);
    else
      this.router.navigate(['trips', 'trip-detail-list', {id: t.id}]);
  }

  public compareObjects(oName1: any, oName2: any): boolean {
    return (oName1 && oName2 && (oName1.id === oName2.id));
  }

  createBus(id: number, licensePlate: string, numberOfSeats: number, model: Model) {
    this.newBusEdit = this.busService.createBus(id,licensePlate,numberOfSeats,model);
  }

}
