import { Component, Input, Output, EventEmitter, forwardRef, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local';

@Component({
  selector: 'app-input',
  standalone: false,
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @ViewChild('inputRef') inputRef!: ElementRef<HTMLInputElement>;

  @Input() label: string = '';
  @Input() type: InputType = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() required: boolean = false;
  @Input() hint: string = '';
  @Input() error: string = '';
  @Input() maxLength: number | null = null;
  @Input() minLength: number | null = null;
  @Input() pattern: string = '';
  @Input() min: string | number | null = null;
  @Input() max: string | number | null = null;
  @Input() step: string | number | null = null;
  @Input() maskName: 'cnpj' | 'cep' | 'telefone' | 'celular' | null = null;

  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();
  @Output() focusEvent = new EventEmitter<void>();

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

  onInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = this.type === 'number' ? parseFloat(target.value) || '' : target.value;
    this.value = newValue;
    this.onChange(newValue);
    this.change.emit(newValue);
  }

  onInputBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  onInputFocus(): void {
    this.focusEvent.emit();
  }

  setFocus(): void {
    if (this.inputRef) {
      this.inputRef.nativeElement.focus();
    }
  }

  getInputClasses(): string {
    const classes = ['form-control'];
    if (this.error) classes.push('error');
    return classes.join(' ');
  }

  get hasError(): boolean {
    return this.touched && !!this.error;
  }
}
