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
  private pendingValueSet = false;
  private pendingValue: any = null;
  selectedIndex: number = -1;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};
  constructor(private cd: ChangeDetectorRef) {}

  writeValue(value: any): void {
    // normalize primitives to string for consistent comparison with options
    this.value = value;
    // if options not yet present, store pending value and wait for options
    if (!this.options || this.options.length === 0) {
      this.pendingValueSet = true;
      this.pendingValue = value;
    } else {
      this.pendingValueSet = false;
      this.pendingValue = null;
      // map value to selectedIndex
      const idx = this.options.findIndex(o => this.areValuesEqual(o.value, value));
      this.selectedIndex = idx >= 0 ? idx : -1;
    }
    try { this.cd.detectChanges(); } catch (e) {}
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
    if (this.multiple) {
      this.value = Array.isArray(selected) ? selected : (selected ? [selected] : []);
    } else {
      this.value = selected === '' ? null : selected;
    }
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onNativeChange(ev: any): void {
    const idx = ev;
    if (idx === '-1' || idx === -1 || idx === null || idx === undefined) {
      this.value = null;
    } else {
      const opt = this.options && this.options.length > 0 ? this.options[Number(idx)] : null;
      this.value = opt ? opt.value : null;
    }
    this.onChange(this.value);
    this.change.emit(this.value);
  }

  onSelectedIndexChange(newIdx: any) {
    // if passed an event, extract target.value safely
    let idx = newIdx;
    try {
      if (newIdx && newIdx.target) idx = newIdx.target.value;
    } catch (e) { /* ignore */ }
    this.onNativeChange(idx);
  }

  onSelectBlur(): void {
    this.touched = true;
    this.onTouched();
    this.blur.emit();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options']) {
      // When options arrive, if there was a pending value, apply it
      if (this.pendingValueSet) {
        this.value = this.pendingValue;
        // find index for pending value
        const idx = this.options.findIndex(o => this.areValuesEqual(o.value, this.pendingValue));
        this.selectedIndex = idx >= 0 ? idx : -1;
        this.pendingValueSet = false;
        this.pendingValue = null;
        this.onChange(this.value);
      }
      // also update selectedIndex when options change and we already have a value
      if (!this.pendingValueSet && this.value != null) {
        const idx2 = this.options.findIndex(o => this.areValuesEqual(o.value, this.value));
        this.selectedIndex = idx2 >= 0 ? idx2 : -1;
      }
      try { this.cd.detectChanges(); } catch (e) {}
    }
  }

  private areValuesEqual(a: any, b: any): boolean {
    // compare primitives and objects by id where possible
    if (a === b) return true;
    if (a == null || b == null) return false;
    // compare numeric/string equality
    if ((typeof a === 'number' || typeof a === 'string') && (typeof b === 'number' || typeof b === 'string')) {
      return String(a) === String(b);
    }
    // try object id comparison
    try {
      if (typeof a === 'object' && typeof b === 'object') {
        if ('id' in a && 'id' in b) return String((a as any).id) === String((b as any).id);
      }
    } catch (e) {}
    return false;
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
