import { isNull } from '@angular/compiler/src/output/output_ast';
import { AfterContentChecked, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit, OnChanges {
 
  @Input('label')
  label!: string;
  @Input('required')
    required!: boolean;
  @Input('value')
    value!: string;
  @Input('disabled')
    disabled!: boolean;
  @Input('hint')
    hint!: string;

  errorMessage!: string;
  @Output()
  notify = new EventEmitter();
  sharedForm!: FormGroup;
  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.sharedForm = this._fb.group({
        sharedFormControl: ['']
    });
    this.setValidation();
    this.setDisabled();
    this.setValue();

    if (!this.required) {
        this.notify.emit({ value: this.sharedForm.get('sharedFormControl')?.value, valid: true });
    }

    this.sharedForm.get('sharedFormControl')?.valueChanges.subscribe(
        value => {
            
            this.notify.emit({ value: value, valid: this.disabled ? true : this.sharedForm.get('sharedFormControl')?.valid });
        }
    );
}

setValidation(): any {
    const sharedFormControl = this.sharedForm.get('sharedFormControl');

    if (this.required) {

        sharedFormControl?.setValidators([Validators.required]);
        this.errorMessage = 'Filed is required';
    } else {
        sharedFormControl?.clearValidators();
    }

    sharedFormControl?.updateValueAndValidity();
}

setValue() {
    if (this.value) {
        this.sharedForm.patchValue({
            sharedFormControl: this.value,
        });
        this.notify.emit({
            value: this.sharedForm.get('sharedFormControl')?.value,
            valid: this.disabled ? true : this.sharedForm.get('sharedFormControl')?.valid
        });
    }
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
        if (propName === "value") {
            let changedProp = changes[propName];
            if (changedProp.currentValue && !changedProp.firstChange) {
                this.setValue();
            }
        }
        if (propName === "disabled") {
            let changedProp = changes[propName];
            if (changedProp.currentValue && !changedProp.firstChange) {
                this.setDisabled();
            }
        }
    }
}
}