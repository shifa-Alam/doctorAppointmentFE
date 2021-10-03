import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent  implements OnInit {

  public confirmation: boolean = false;

  constructor(public dialogRef: MatDialogRef<ModalComponent>) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.confirmation = false;
  }

  onConfirm() {
    this.dialogRef.close(true);
    this.confirmation = true;
  }

  cancelClick() {
    this.dialogRef.close(false);
    this.confirmation = false;
  }

}
