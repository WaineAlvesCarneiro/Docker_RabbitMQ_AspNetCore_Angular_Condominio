import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnChanges {
  @Input() label = '';
  @Input() options: SelectOption[] = [];
  @Input() placeholder = 'Selecione uma opção';
  @Input() required = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() multiple = false;
  @Output() change = new EventEmitter<any>();
  @Output() blur = new EventEmitter<void>();

  value: any = null;
  disabled = false;
  touched = false;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  constructor(private cd: ChangeDetectorRef) {}

  writeValue(value: any): void {
    this.value = value;
    // ensure view updates when value is written, especially if options arrive later
    try { this.cd.detectChanges(); } catch (e) { /* ignore */ }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onSelectChange(selected: any): void {
    // selected comes from ngModel/ngModelChange: it preserves original types when using [ngValue]
    if (this.multiple) {
      this.value = Array.isArray(selected) ? selected : (selected ? [selected] : []);
    } else {
      this.value = selected === '' ? null : selected;
    }
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onSelectBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // when options change, ensure the template reflects current value
      try { this.cd.detectChanges(); } catch (e) { /* ignore */ }
    }
  }

  get hasError(): boolean {
    return this.touched && !!this.error;
  }

  getSelectClasses(): string {
    const classes = ['form-control'];
    if (this.error) {
      classes.push('error');
    }
    return classes.join(' ');
  }
}
