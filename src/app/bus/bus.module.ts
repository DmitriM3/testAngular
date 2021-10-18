import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusRoutingModule } from './bus-routing.module';
import { BusListComponent } from './bus-list/bus-list.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material/material.module";
import {DialogModule} from "../dialog/dialog.module";
import { BusDetailComponent } from './bus-detail/bus-detail.component';


@NgModule({
  declarations: [
    BusListComponent,
    BusDetailComponent
  ],
    imports: [
        CommonModule,
        BusRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        DialogModule,
        FormsModule,
    ]
})
export class BusModule { }
