import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TripListComponent} from "./trip-list/trip-list.component";
import {TripPersonListComponent} from "./trip-person-list/trip-person-list.component";
import {TripBusDetailComponent} from "./trip-bus-detail/trip-bus-detail.component";
import {TripDetailComponent} from "./trip-detail/trip-detail.component";

const routes: Routes = [
  {path: 'list', component: TripListComponent},
  {path: 'trip-person-list', component: TripPersonListComponent},
  {path: 'trip-bus-list', component: TripBusDetailComponent},
  {path: 'trip-detail', component: TripDetailComponent},
  {path: '', redirectTo: 'list', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TripRoutingModule { }
