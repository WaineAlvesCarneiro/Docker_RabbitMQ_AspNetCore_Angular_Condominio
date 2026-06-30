import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.html',
  styleUrls: ['./confirmation.css'],
  standalone: false,
})
export class Confirmation {
  @Input() message: string = 'Tem certeza que deseja continuar?';
  @Output() result = new EventEmitter<boolean>();

  onClose(confirmed: boolean): void {
    this.result.emit(confirmed);
  }
}
