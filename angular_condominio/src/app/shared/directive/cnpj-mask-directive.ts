import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[cnpjMask]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CnpjMaskDirective),
    multi: true
  }]
})
export class CnpjMaskDirective implements ControlValueAccessor {
  private onChange: (v: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef<HTMLInputElement>) {}

  writeValue(value: any): void {
    const digits = this.getDigits(String(value ?? ''));
    this.el.nativeElement.value = this.format(digits);
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.el.nativeElement.disabled = isDisabled;
  }

  @HostListener('input')
  handleInput() {
    const inputEl = this.el.nativeElement;
    const raw = inputEl.value;
    const digits = this.getDigits(raw);
    const formatted = this.format(digits);
    inputEl.value = formatted;
    this.onChange(digits);
  }

  @HostListener('blur')
  handleBlur() { this.onTouched(); }

  private getDigits(s: string) { return s.replace(/\D/g, '').slice(0, 14); }

  private format(d: string) {
    if (!d) return '';
    if (d.length <= 2) return d;
    if (d.length <= 5) return `${d.slice(0,2)}.${d.slice(2)}`;
    if (d.length <= 8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`;
    if (d.length <= 12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`;
    return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12,14)}`;
  }
}
