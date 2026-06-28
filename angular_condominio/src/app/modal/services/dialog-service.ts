// src\app\modal\services\dialog-service.ts

import { ApplicationRef, ComponentRef, EmbeddedViewRef, Injectable, Injector, createComponent, EnvironmentInjector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Confirmation } from '../confirmation/confirmation';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private environmentInjector: EnvironmentInjector, private appRef: ApplicationRef) {}

  openConfirmation(message: string): Observable<boolean> {
    const subject = new Subject<boolean>();

    const componentRef = createComponent(Confirmation, {
        environmentInjector: this.environmentInjector
    });

    componentRef.instance.message = message;
    componentRef.instance.result.subscribe(result => {
      subject.next(result);
      subject.complete();
      this.closeModal(componentRef);
    });

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    document.body.appendChild(domElem);

    return subject.asObservable();
  }

  private closeModal(componentRef: ComponentRef<any>) {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
