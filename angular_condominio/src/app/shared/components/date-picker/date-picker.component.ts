import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: false,
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() placeholder: string = 'DD/MM/YYYY';
  @Input() min: string | null = null;
  @Input() max: string | null = null;
  @Input() id: string = `datepicker-${Math.random().toString(36).substr(2, 9)}`;

  @Output() change = new EventEmitter<string>();
  @Output() blur = new EventEmitter<void>();

  value: string = '';
  touched: boolean = false;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    if (!value) {
      this.value = '';
      return;
    }

    if (typeof value === 'string' && value.indexOf('/') !== -1) {
      this.value = this.formatDateToISO(value);
    } else if (typeof value === 'string' && value.indexOf('-') !== -1) {
      const dateOnly = value.split('T')[0];
      this.value = dateOnly;
    } else {
      this.value = value;
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;

    if (this.value) {
      this.onChange(this.value);
      this.change.emit(this.value);
    }
  }

  onDateBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  getInputClasses(): string {
    const classes = ['form-control'];
    if (this.error) classes.push('error');
    return classes.join(' ');
  }

  get hasError(): boolean {
    return this.touched && !!this.error;
  }

  formatDateToISO(dateStr: string): string {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/');
    if (day && month && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }

  formatDateToBR(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    if (day && month && year) {
      return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
    }
    return dateStr;
  }
}
