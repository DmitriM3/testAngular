import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PersonListComponent} from "./person-list/person-list.component";
import {PersonDetailComponent} from "./person-detail/person-detail.component";

const routes: Routes = [
  {path: 'list', component: PersonListComponent},
  {path: 'detail', component: PersonDetailComponent},
  {path: '', redirectTo: 'list', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonRoutingModule { }
