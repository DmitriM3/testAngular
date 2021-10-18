import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Brand} from "../../domain/brand";
import {Model} from "../../domain/model";
import {BusService} from "../bus.service";
import {Bus} from "../../domain/bus";

@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrls: ['./bus-detail.component.css']
})
export class BusDetailComponent implements OnInit {

  formBus: FormGroup = this.fb.group({
    id: [null, []],
    licensePlate: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(7)]],
    numberOfSeats: ['', [Validators.required, Validators.min(1), Validators.max(90)]],
    model: ['',[Validators.required]],
    marca: ['',[Validators.required]],
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
              public fb: FormBuilder,
              public router: Router,
              private busService: BusService,
              private snackBar: MatSnackBar ) {
  }

  ngOnInit(): void {
    this.busService.findAllBrands().subscribe(list => {
      this.brands = list;
    });
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
    });
  }

  public get fc() {
    return this.formBus.controls;
  }

  buildForm(bus: Bus | null) {
    if (bus != null)
      this.formBus.patchValue({
        id: bus.id,
        licensePlate: bus.licensePlate,
        numberOfSeats: bus.numberOfSeats,
        model: bus.model,
        marca: bus.model.brand,
        modelo: bus.model.name,
        brand: bus.model.brand.name
      })
  }

  findBrands() {
    this.busService.findAllBrands().subscribe(list => {
      this.brands = list;
      this.loading = false;
    });
  }

  findModels(id: number) {
    this.busService.findAllModels(id).subscribe(list => {
      this.models = list;
      this.loading = false;
    });
  }


  goToBack() {
    this.router.navigate(['buses', 'list']);
  }

  save() {
    if (this.modelSelected == null){
      this.modelSelected = this.formBus.get(['model'])?.value;
    }
    const bus = new Bus(
      this.formBus.get(["id"])?.value,
      this.formBus.get(["licensePlate"])?.value,
      this.formBus.get(["numberOfSeats"])?.value,
      this.modelSelected,
    );
    if (bus.id != null) {
      this.busService.update(bus).subscribe(p => {
          this.snackBar.open("Se actualizo con exito", "Éxito", { duration: 2000 });
          this.goToBack();
        },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
        }
      )
    } else {
      this.busService.create(bus).subscribe(p => {
          this.snackBar.open("El colectivo se creo con exito", "Éxito", { duration: 2000 });
          this.goToBack();
        },
        error => {
          this.snackBar.open(error, "Error", { duration: 2000 });
          console.log(error)
        }
      )
    }
  }

  createBrand(id: number, name: string, models: [string]) {
    this.brandSelected = this.busService.createBrand(id, name, models);
  }

  createModel(id: number, name: string, brand: Brand) {
    this.modelSelected = this.busService.createModel(id,name,this.brandSelected);

  }
}
