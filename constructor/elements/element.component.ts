import { Component, Input, AfterViewInit } from '@angular/core';

import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'element',
  templateUrl: 'element.component.html',
  styleUrls: ['element.component.sass']
})
export class ElementComponent implements AfterViewInit {
  @Input() data: any;
  ngAfterViewInit() {
  }
}
