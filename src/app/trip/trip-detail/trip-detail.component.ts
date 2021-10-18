import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Trip} from "../../domain/trip";
import {TripService} from "../trip.service";
import {BusService} from "../../bus/bus.service";
import {Brand} from "../../domain/brand";
import {Model} from "../../domain/model";
import {Bus} from "../../domain/bus";

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  formTrip: FormGroup = this.fb.group({
    id: [null, []],
    origen: ['', [Validators.required]],
    destination: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: ['', [Validators.required]],
    bus: ['', [Validators.required]],
    passengers: [''],
    modelo: [''],
    brand: [''],
  })
  loading: boolean = false;
  brands: Brand[] = [];
  models: Model[] = [];
  // @ts-ignore
  brandSelected: Brand;
  // @ts-ignore
  modelSelected: Model;
  bus!: Bus | null;

  constructor(public route: ActivatedRoute,
              public tripService: TripService,
              public busService: BusService,
              public fb: FormBuilder,
              public router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.loading = true;
      let paramId = param.get("id");
      if (paramId != null) {
        const id = parseInt(paramId);
        this.tripService.findTrip(id).subscribe(bus => {
            this.buildForm(bus);
            // this.bus = bus;
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
    this.busService.findAllBrands().subscribe(list => {
      this.brands = list;
    });
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
        modelo: trip.bus.model.name,
        brand: trip.bus.model.brand.name
      })
  }

  public get fc() {
    return this.formTrip.controls;
  }

  save() {
    if (this.modelSelected == null){
      this.modelSelected = this.formTrip.get(['model'])?.value;
    }
    const trip = new Trip(
      this.formTrip.get(["id"])?.value,
      this.formTrip.get(["origen"])?.value,
      this.formTrip.get(["destination"])?.value,
      this.formTrip.get(["startDate"])?.value,
      this.formTrip.get(["endDate"])?.value, this.formTrip.get(["bus"])?.value, null);
    if (trip.id != null) {
      this.tripService.update(trip).subscribe(p => {
          this.snackBar.open("La persona se actualizó con exito", "Éxito", { duration: 2000 });
          this.goToBack();
        },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
        }
      )
    } else {
      this.tripService.create(trip).subscribe(p => {
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
    this.router.navigate(['trips', 'list']);
  }

  findBusModels(id: number) {
    this.busService.findAllModels(id).subscribe(list => {
      this.models = list;
      this.loading = false;
    });
  }

  createBrand(id: number, name: string, models: [string]) {
    this.brandSelected = this.busService.createBrand(id, name, models);
  }

  createModel(id: number, name: string, brand: Brand) {
    this.modelSelected = this.busService.createModel(id,name,this.brandSelected);
  }
}
