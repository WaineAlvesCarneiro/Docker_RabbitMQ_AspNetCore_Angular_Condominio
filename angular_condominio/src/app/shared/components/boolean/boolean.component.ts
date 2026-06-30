import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-boolean',
  standalone: false,
  templateUrl: './boolean.component.html',
  styleUrls: ['./boolean.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BooleanComponent),
      multi: true
    }
  ]
})
export class BooleanComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() id: string = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  @Output() change = new EventEmitter<boolean>();

  value: boolean = false;
  touched: boolean = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onCheckboxChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.checked;
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onCheckboxBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  get hasError(): boolean {
    return this.touched && !!this.error;
  }
}
