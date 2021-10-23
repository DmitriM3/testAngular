import { Component, OnInit } from '@angular/core';
import {Trip} from "../../domain/trip";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {TripService} from "../trip.service";

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent implements OnInit {

  displayedColumns: string[] = ['id', 'departure', 'destination', 'startDate', 'endDate',
    'bus','passengers','option'];

  trips: Trip[] = [];
  loading: boolean = false;

  constructor(public router: Router,
              private tripService: TripService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.findAll();
  }
  findAll() {
    this.tripService.findAll().subscribe(list => {
      this.trips = list;
      console.log(this.trips);
      this.loading = false;
    });
  }

  goToDetail(t: Trip | null) {
    if (t == null)
      this.router.navigate(['trips', 'trip-detail']);
    else
      this.router.navigate(['trips', 'trip-detail', {id: t.id}]);
  }

  // delete(id: number)  {
  //   let dialogData = new DialogData(null,
  //     "¿Está seguro que desea eliminar el viaje?", "Confirmación para eliminar");
  //   const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
  //     width: '300px',
  //     height: 'auto',
  //     minHeight: 200,
  //     data: dialogData
  //   });
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result.event == 'delete') {
  //       this.loading = true;
  //       this.tripService.delete(id).subscribe(p => {
  //           this.findAll()
  //           this.snackBar.open("El colectivo se elimino con exito", 'Éxito', {duration: 2000});
  //         },
  //         error => {
  //           this.snackBar.open(error, "Error", {duration: 2000});
  //           this.loading = false;
  //         });
  //     }
  //   });
  // }

  goToPassengersDetail(t: Trip | null) {
    if (t == null)
      this.router.navigate(['trips', 'list']);
    else
      this.router.navigate(['trips', 'trip-person-list', {id: t.id}]);
  }

  goToBusDetail(t: Trip | null) {
    if (t == null)
      this.router.navigate(['trips', 'list']);
    else
      this.router.navigate(['trips', 'trip-bus-list', {id: t.bus.id}]);
  }
}
