import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TripService} from "../trip.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Bus} from "../../domain/bus";
import {BusService} from "../../bus/bus.service";

@Component({
  selector: 'app-trip-bus-detail',
  templateUrl: './trip-bus-detail.component.html',
  styleUrls: ['./trip-bus-detail.component.css']
})
export class TripBusDetailComponent implements OnInit {
  displayedColumns: string[] = ['id', 'licensePlate', 'numberOfSeats', 'model_name','brand_name'];
  loading: boolean = false;
  formBus: FormGroup = this.fb.group({
    id: [null, []],
    licensePlate: [''],
    numberOfSeats: [''],
    model: [''],
    marca: [''],
  })

  bus!: Bus | null;

  constructor(public route: ActivatedRoute,
              private busService: BusService,
              public fb: FormBuilder,
              public router: Router,
              private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(param => {
      this.loading = true;
      let paramId = param.get("id");
      if (paramId != null) {
        const id = parseInt(paramId);
        this.busService.findOneBus(id).subscribe(bus => {
            this.buildForm(bus);
            this.bus = bus;
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
    })
  }
  buildForm(bus: Bus | null) {
    if (bus != null)
      this.formBus.patchValue({
        id: bus.id,
        licensePlate: bus.licensePlate,
        numberOfSeats: bus.numberOfSeats,
        model: bus.model.name,
        marca: bus.model.brand.name,
      })
  }

  goToBack() {
    this.router.navigate(['trips', 'list']);
  }
}
