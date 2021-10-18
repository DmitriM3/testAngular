import {Component, Inject, OnInit} from '@angular/core';
import {DialogData} from "../dialog-data";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-confirm-dialog',
  templateUrl: './delete-confirm-dialog.component.html',
  styleUrls: ['./delete-confirm-dialog.component.css']
})
export class DeleteConfirmDialogComponent implements OnInit {

  dialogData: DialogData;

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogData = data;
  }

  onNoClick(): void {
    this.dialogRef.close({event: 'cancel'});
  }

  doAction() {
    this.dialogRef.close({event: 'delete'});
  }


  ngOnInit() {
  }

}
