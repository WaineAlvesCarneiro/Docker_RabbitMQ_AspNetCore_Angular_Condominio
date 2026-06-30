import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[telefoneMask]',
  standalone: false,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TelefoneMaskDirective),
    multi: true
  }]
})
export class TelefoneMaskDirective implements ControlValueAccessor {
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
    const caretBefore = inputEl.selectionStart ?? 0;
    const digitsBeforeCaret = raw.slice(0, caretBefore).replace(/\D/g, '').length;

    const digits = this.getDigits(raw);
    const formatted = this.format(digits);

    inputEl.value = formatted;

    let pos = 0, seen = 0;
    while (pos < formatted.length && seen < digitsBeforeCaret) {
      if (/\d/.test(formatted[pos])) seen++;
      pos++;
    }
    inputEl.setSelectionRange(pos, pos);

    this.onChange(digits);
  }

  @HostListener('blur')
  handleBlur() {
    this.onTouched();
  }

  private getDigits(s: string) {
    return s.replace(/\D/g, '').slice(0, 11);
  }

  private format(d: string) {
  if (!d) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
    return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7,11)}`;
  }
}
