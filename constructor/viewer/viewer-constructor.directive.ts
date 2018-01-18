import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[viewer-host]',
})
export class AdDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
