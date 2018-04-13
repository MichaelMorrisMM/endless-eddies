import { Subject } from "rxjs/Subject";
import { Input, ElementRef, HostBinding } from "@angular/core";
import { NgContentAst } from "@angular/compiler";
import { NgControl, FormBuilder } from "@angular/forms";
import { FocusMonitor } from "@angular/cdk/a11y";
import { coerceBooleanProperty } from '@angular/cdk/coercion';

// This class implements many functions all matFormFieldControls need to implement,
// so it doesn't need to go into every component.  All custom
// MatFormFieldControls should extend this class.

// This class is based on the Angular Material guide here:
//   https://material.angular.io/guide/creating-a-custom-form-field-control

export class matFormFieldControlBoilerplate {
  ngControl: NgControl = null;
  focused = false;
  stateChanges = new Subject<void>();
  static nextId = 0;
  private _placeholder:string;
  private _required = false;
  private _disabled = false;
  errorState = false;
  
  constructor() { }
  
  @Input()
  get placeholder() {
    return this._placeholder;
  }
  set placeholder(plh) {
    this._placeholder = plh;
    this.stateChanges.next();
  }
  
  @Input()
  get required() {
    return this._required;
  }
  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(dis) {
    this._disabled = coerceBooleanProperty(dis);
    this.stateChanges.next();
  }
  
  @HostBinding('attr.aria-describedby') describedBy = '';
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
}