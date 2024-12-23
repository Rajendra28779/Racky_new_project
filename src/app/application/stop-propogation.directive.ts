import { Directive, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';

@Directive({
  selector: '[appStopPropogation]'
})
export class StopPropogationDirective {

  constructor(private elementRef: ElementRef) { }

  public ngAfterViewInit() {
    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'click', { capture: true })
      .subscribe(event => {
        //console.log('catched');
        event.stopPropagation();
      });
  }
}
