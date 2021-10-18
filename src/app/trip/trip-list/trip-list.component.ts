import { Component, OnInit } from '@angular/core';
import {Trip} from "../../domain/trip";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {TripService} from "../trip.service";
import {Person} from "../../domain/person";

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

  delete(id: number) {

  }

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
