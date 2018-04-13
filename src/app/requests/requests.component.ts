// NOTE: the way the form is built in this component and the HTML template is based on the following link: https://juristr.com/blog/2017/10/demystify-dynamic-angular-forms/

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { ConfiguratorService } from '../services/configurator.service';
import {Config} from "../configurator/config.interface";

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styles: []
})
export class RequestsComponent implements OnInit {
  config: Config; // The config file
  requestForm: FormGroup;
  configComponents; // the components pulled from the config file
  constructor(public configuratorService: ConfiguratorService) {
    // // Pull out the items from the config file
    // this.configComponents =
    //   Object.keys(this.config)
    //   .map(item => {
    //     return Object.assign({}, { key: item}, this.config[item]);
    //   });

    //   // Set up the form dynamically for the config file's components
    //   const formGroup = {};
    //   for(let component of Object.keys(this.config)) {
    //     formGroup[component] = new FormControl(this.config[component].value || '', this.mapValidators(this.config[component].validation));
    //   }
    //   this.requestForm = new FormGroup(formGroup);
    
    this.requestForm = new FormGroup({});
  }
  ngOnInit() {
    this.configuratorService.getConfiguration().subscribe( (con) => {
      this.config = con;
      
      // Pull out the items from the config file
      this.configComponents =
      Object.keys(this.config)
      .map(item => {
        return Object.assign({}, { key: item}, this.config[item]);
      });

      // Set up the form dynamically for the config file's components
      //const formGroup = {};
      for(let component of Object.keys(this.config)) {
        this.requestForm[component] = new FormControl(this.config[component].value || '', this.mapValidators(this.config[component].validation));
      }
    //this.requestForm = new FormGroup(formGroup);
    });
  }

  mapValidators(validators) {
    const formValidators = [];

    return formValidators;
  }
}
