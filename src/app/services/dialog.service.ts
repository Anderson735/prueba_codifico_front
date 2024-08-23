import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogData } from '../interfaces/dialog-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(public dialog: MatDialog) { }

  openDialog(data: DialogData): Observable<any> {
    const dialogRef: MatDialogRef<DialogComponent> = this.dialog.open(DialogComponent, {
      data,
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

}
