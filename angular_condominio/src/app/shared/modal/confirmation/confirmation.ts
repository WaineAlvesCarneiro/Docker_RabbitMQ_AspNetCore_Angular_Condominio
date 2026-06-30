import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  standalone: false,
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css'
})
export class Confirmation {
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Output() result = new EventEmitter<boolean>();

  onClose(confirmed: boolean) {
    this.result.emit(confirmed);
  }
}
