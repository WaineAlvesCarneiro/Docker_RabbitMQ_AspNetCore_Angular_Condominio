import { Directive, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[formSubmitValidate]',
  standalone: true
})
export class FormSubmitValidate {
  @Input('formSubmitValidate') formGroup!: FormGroup;

  @HostListener('ngSubmit', ['$event'])
  onSubmit(event: Event): void {
    if (this.formGroup) {
      this.markFormGroupAsTouched(this.formGroup);
    }
  }

  private markFormGroupAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
