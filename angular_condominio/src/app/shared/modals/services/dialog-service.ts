import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  createComponent,
  EnvironmentInjector
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Confirmation } from '../confirmation/confirmation';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private activeModal?: ComponentRef<any>;

  constructor(
    private environmentInjector: EnvironmentInjector,
    private appRef: ApplicationRef
  ) {}

  openConfirmation(message: string): Observable<boolean> {
    // fecha modal anterior se existir
    if (this.activeModal) {
      this.closeModal(this.activeModal);
    }

    const subject = new Subject<boolean>();
    const componentRef = createComponent(Confirmation, {
      environmentInjector: this.environmentInjector
    });

    componentRef.instance.message = message;
    this.activeModal = componentRef;

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    (componentRef as any).domElem = domElem;

    componentRef.instance.result.subscribe(result => {
      subject.next(result);
      this.closeModal(componentRef, subject);
      this.activeModal = undefined;
    });

    this.appRef.attachView(componentRef.hostView);
    document.body.appendChild(domElem);

    return subject.asObservable();
  }

  private closeModal(componentRef: ComponentRef<any>, subject?: Subject<boolean>): void {
    this.appRef.detachView(componentRef.hostView);

    const domElem = (componentRef as any).domElem as HTMLElement;

    // garante que remove o mesmo nó anexado
    if (domElem && document.body.contains(domElem)) {
      document.body.removeChild(domElem);
      console.log('✅ Modal removido do body');
    }

    componentRef.destroy();
    if (subject) subject.complete();
  }
}
