import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() block: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  // Common native attributes passed-through
  @Input() id?: string;
  @Input() name?: string;
  @Input() value?: string | number;
  @Input('aria-label') ariaLabel?: string;
  @Input('aria-pressed') ariaPressed?: boolean | null = null;
  @Input() ariaCurrent?: string | null = null;
  @Input() title?: string;
  @Input() tabIndex?: number;
  @Input() active: boolean = false;

  @Output() click = new EventEmitter<void>();

  onButtonClick() {
    if (!this.disabled && !this.loading) {
      this.click.emit();
    }
  }

  getButtonClasses(): string {
    const classes = ['btn', 'btn-' + this.variant, 'btn-' + this.size];
    if (this.block) classes.push('btn-block');
    if (this.loading) classes.push('btn-loading');
    return classes.join(' ');
  }
  // Refreshed file context - no functional change
}
