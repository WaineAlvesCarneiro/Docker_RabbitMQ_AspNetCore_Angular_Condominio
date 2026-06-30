import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  standalone: false,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder: string = 'Selecione uma opção';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() multiple: boolean = false;

  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();

  value: any = '';
  touched: boolean = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = this.multiple 
      ? Array.from(target.selectedOptions, option => option.value)
      : target.value;
    this.value = newValue;
    this.onChange(newValue);
    this.change.emit(newValue);
  }

  onSelectBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  getSelectClasses(): string {
    const classes = ['form-control'];
    if (this.error) classes.push('error');
    return classes.join(' ');
  }

  get hasError(): boolean {
    return this.touched && !!this.error;
  }

  getSelectedLabel(): string {
    if (!this.value) return this.placeholder;

    const selected = this.options.find(opt => opt.value === this.value);
    return selected ? selected.label : this.placeholder;
  }
}
