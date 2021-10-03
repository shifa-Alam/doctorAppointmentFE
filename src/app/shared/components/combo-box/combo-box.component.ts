import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-combo-box',
  templateUrl: './combo-box.component.html',
  styleUrls: ['./combo-box.component.css']
})
export class ComboBoxComponent implements OnInit, OnChanges {

  errorMessage = 'Filed is required';
  sharedForm!: FormGroup;

  @Input('placeHolder')
  placeHolder!: string;
  @Input('noneOptionDisabled')
  noneOptionDisabled!: boolean;
  @Input('value')
  value!: number;
  @Input('list')
  list!: any[];
  @Input('required')
  required!: boolean;
  @Input('disabled')
  disabled!: boolean;

  @Output() selectValue = new EventEmitter();

  constructor(
    private _fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.sharedForm = this._fb.group({
      sharedFormControl: ['']
    });
    this.setValidation();
    this.setValue();
    this.setDisabled();
    if (!this.required) {
      this.selectValue.emit({ value: this.sharedForm.value.sharedFormControl, valid: true });
    } else {
      this.selectValue.emit({ value: this.sharedForm.value.sharedFormControl, valid: this.sharedForm.valid });
    }

    this.sharedForm.get('sharedFormControl')?.valueChanges.subscribe(
        value => {
          this.selectValue.emit({ value: value, valid: false });
        }
      );

  }

  onChange() {
    this.selectValue.emit({ value: this.sharedForm.value.sharedFormControl, valid: this.sharedForm.valid });
  }

  setValue(): void {
    if (this.value > 0) {
      this.sharedForm.get('sharedFormControl')?.patchValue(this.value);
    } else {
      this.sharedForm.get('sharedFormControl')?.patchValue('');
    }

    this.selectValue.emit({ value: this.sharedForm.value.sharedFormControl, valid: this.sharedForm.valid });
  }

  setValidation(): any {
    const sharedFormControl = this.sharedForm.get('sharedFormControl');

    if (this.required) {
      sharedFormControl?.setValidators([Validators.required]);
    } else {
      sharedFormControl?.clearValidators();
    }
    sharedFormControl?.updateValueAndValidity();
  }

  setDisabled() {
    const sharedFormControl = this.sharedForm.get('sharedFormControl');

    if (this.disabled) {
      sharedFormControl?.disable();
    } else {
      sharedFormControl?.enable();
    }
  }

  clear(): void {
    this.sharedForm.patchValue({
      sharedFormControl: '',
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }): void {
    for (let propName in changes) {
      if (propName === "list") {
        let changedProp = changes[propName];
        if (changedProp.currentValue && !changedProp.firstChange) {
          this.setValue();
        }
      }
      if (propName === "value") {
        let changedProp = changes[propName];
        // if (changedProp.currentValue && !changedProp.firstChange) {
        if (!changedProp.firstChange) {
          this.setValue();
        }
      }
      if (propName === "disabled") {
        let changedProp = changes[propName];
        //if (changedProp.currentValue && !changedProp.firstChange) {
        if (!changedProp.firstChange) {
          this.setDisabled();
        }
      }
    }
  }
}