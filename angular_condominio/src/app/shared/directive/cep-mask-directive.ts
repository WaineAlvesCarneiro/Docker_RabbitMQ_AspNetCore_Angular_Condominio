import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[cepMask]',
  standalone: true,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CepMaskDirective),
    multi: true
  }]
})
export class CepMaskDirective implements ControlValueAccessor {
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

  private getDigits(s: string) { return s.replace(/\D/g, '').slice(0, 8); }

  private format(d: string) {
    if (!d) return '';
    if (d.length <= 5) return d;
    return `${d.slice(0,5)}-${d.slice(5)}`;
  }
}
