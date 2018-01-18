import {Component, Input} from '@angular/core';
import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'radio-group-element',
  templateUrl: './radio-group.element.component.html',
  styleUrls: ['./radio-group.element.component.sass']
})
export class RadioGroupElementComponent {
  @Input() data: any;

  public OnCheckRadio(item) {
    this.data.value = item.id;
    if ( this.data.eventProcessor && this.data.vm && this.data.idElement  ) {
      this.data.eventProcessor(this.data.vm, this.data.idElement)
    }
  }
}

/*
Входные параметры:
  groupName: 'Наименование группы'
  horizontal: true - горизонтальное отображение, false - вертикальное
  value: значение по-умолчанию
  values:
Выходные параметры:
*/
