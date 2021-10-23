import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TripRoutingModule} from './trip-routing.module';
import {TripListComponent} from './trip-list/trip-list.component';
import {MaterialModule} from "../material/material.module";
import {TripPersonListComponent} from './trip-person-list/trip-person-list.component';
import {TripBusDetailComponent} from './trip-bus-detail/trip-bus-detail.component';
import {FormsModule} from "@angular/forms";
import {TripDetailComponent} from './trip-detail/trip-detail.component';


@NgModule({
  declarations: [
    TripListComponent,
    TripPersonListComponent,
    TripBusDetailComponent,
    TripDetailComponent
  ],
  imports: [
    CommonModule,
    TripRoutingModule,
    MaterialModule,
    FormsModule,
  ]
})
export class TripModule {
}
