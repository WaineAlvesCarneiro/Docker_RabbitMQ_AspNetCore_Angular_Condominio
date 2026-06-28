import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefonepipe',
  standalone: true
})
export class TelefonePipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    const v = value.toString().replace(/\D/g, '');
    if (v.length === 11) {
      return v.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (v.length === 10) {
      return v.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return value.toString();
  }
}
