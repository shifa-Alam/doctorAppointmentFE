import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit, AfterContentChecked {
  private unsubscribe$ = new Subject<void>();

  @Input('message')
  message!: string;
  @Input('action')
  action!: string;
  @Input('show')
  show!: boolean;

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private _snackBarService: SnackBarService,
    private _snackBar: MatSnackBar,
    private _cdRef: ChangeDetectorRef) {

    this._snackBarService.onSuccess$.subscribe(
      data => {

        this.openSnackBar(data.message, 'successSnackbar', '');

      }
    );

    this._snackBarService.onError$.subscribe(
      data => {

        this.openSnackBar(data.message, 'errorSnackbar', "got it")
      }

    );

  }

  ngOnInit() { }

  openSnackBar(message: string, className: string, action: string) {
    if (action) {
      this._snackBar.open(message,
        action,
        {
          panelClass: className,
          verticalPosition: this.verticalPosition,
        });
    } else {
      this._snackBar.open(message,
        action,
        {
          duration: 3000,
          panelClass: className,
          verticalPosition: this.verticalPosition,
        });
    }
  }

  ngAfterContentChecked(): void {
    this._cdRef.detectChanges();
  }

  ngOnDestroy(): void {

    this.unsubscribe$.next();
    this.unsubscribe$.unsubscribe();
  }
}