import {Component, OnInit} from '@angular/core';
import {Person} from "../../domain/person";
import {Router} from "@angular/router";
import {PersonService} from "../../person/person.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DialogData} from "../../dialog/dialog-data";
import {DeleteConfirmDialogComponent} from "../../dialog/delete-confirm-dialog/delete-confirm-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.css']
})
export class PersonListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'age', 'option'];
  persons: Person[] = [];
  loading: boolean = false;

  constructor(public router: Router,
              private personService: PersonService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.findAll();
  }

  findAll() {
    this.personService.findAll().subscribe(list => {
      this.persons = list;
      this.loading = false;
    });
  }

  goToDetail(p: Person | null) {
    if (p == null)
      this.router.navigate(['persons', 'detail']);
    else
      this.router.navigate(['persons', 'detail', {id: p.id}]);
  }

  delete(id: number) {
    let dialogData = new DialogData(null,
      "¿Está seguro que desea eliminar la persona?", "Confirmación para eliminar");
    const dialogRef = this.dialog.open(DeleteConfirmDialogComponent, {
      width: '300px',
      height: 'auto',
      minHeight: 200,
      data: dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.event == 'delete') {
        this.loading = true;
        this.personService.delete(id).subscribe(p => {
            this.findAll()
            this.snackBar.open("La persona se elimino con exito", 'Éxito', {duration: 2000});
          },
          error => {
            this.snackBar.open(error, "Error", {duration: 2000});
            this.loading = false;
          });
      }
    });
  }
}
