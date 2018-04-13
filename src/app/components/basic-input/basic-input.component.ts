import { Component, OnInit, Input, ElementRef, HostBinding } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { matFormFieldControlBoilerplate } from '../matFormFieldControlBoilerplate';
import { FocusMonitor } from '@angular/cdk/a11y';

export class BasicInput {
  constructor(public test: string) {}
}

@Component({
  selector: 'app-basic-input',
  template: `
    <input class="test" formControlName="test" size="3" [disabled]="disabled">
  `,
  styles: [`
    span {
      opacity: 0;
      transition: opacity 200ms;
    }
    :host.floating span {
      opacity: 1;
    }
  `],
  providers: [{provide: MatFormFieldControl, useExisting: BasicInputComponent}],
})
export class BasicInputComponent extends matFormFieldControlBoilerplate implements MatFormFieldControl<BasicInput>{
  thing: FormGroup;
  @HostBinding() id = 'app-basic-input-${AppBasicInput.nextId++}';
  controlType = 'app-basic-input';
  
  constructor(fb: FormBuilder, private fm: FocusMonitor, private elRef: ElementRef) {
    super(); //it's required to call this, but it doesn't do anything
    this.thing = fb.group({
      'test': '',
    });
    
    fm.monitor(elRef.nativeElement, true)
      .subscribe(origin => {
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }
  
  // The below are functions implemented for MatFormFieldControl, with specific values for this component.
  // They are not declared in 'matFormFieldControlBoilerplate' _because_ they have values specific for this class.
  // Inside of any class implementing MatFormFieldControl (custom Angular Material Form Controls), it should 
  // also extend 'matFormFieldControlBoilerplate' as well as implement the below functions.
  @Input()
  get value(): BasicInput | null {
    return this.thing.value;
  }
  set value(basic: BasicInput | null) {
    basic = basic || new BasicInput('');
    this.thing.setValue({test: '1'});
    this.stateChanges.next();
  }
  
  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }
  
  get empty() {
    let n = this.thing.value;
    return !n.area && !n.exchange && !n.subscriber;
  }
  
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }
  
  onContainerClick(event: MouseEvent) {
    if((event.target as Element).tagName.toLowerCase() != 'input') {
      this.elRef.nativeElement.querySelector('input').focus();
    }
  }
}