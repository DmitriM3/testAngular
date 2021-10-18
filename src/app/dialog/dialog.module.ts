import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteConfirmDialogComponent} from './delete-confirm-dialog/delete-confirm-dialog.component';
import {MaterialModule} from "../material/material.module";


@NgModule({
  declarations: [
    DeleteConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class DialogModule {
}
