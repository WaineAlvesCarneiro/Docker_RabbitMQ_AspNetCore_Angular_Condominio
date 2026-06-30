import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpjpipe',
  standalone: false
})
export class CnpjPipe implements PipeTransform {
  transform(value: string | number): string {
    if (!value) return '';
    const v = value.toString().replace(/\D/g, '');
    if (v.length === 14) {
      return `${v.substring(0, 2)}` +
        `.${v.substring(2, 5)}` +
        `.${v.substring(5, 8)}/` +
        `${v.substring(8, 12)}-` +
        `${v.substring(12, 14)}`;
    }
    return value.toString();
  }
}
