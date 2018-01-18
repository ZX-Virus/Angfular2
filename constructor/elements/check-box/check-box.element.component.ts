import {Component, Input} from '@angular/core';
import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'check-box-element',
  templateUrl: './check-box.element.component.html',
  styleUrls: ['./check-box.element.component.sass']
})
export class CheckBoxElementComponent {
  @Input() data: any;

  changeCheckBox () {
    if (this.data.eventProcessor)
      this.data.eventProcessor(this.data.vm, this.data.idElement)
  }
}
