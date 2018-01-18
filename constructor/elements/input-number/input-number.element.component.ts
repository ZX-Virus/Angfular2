import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'input-number-element',
  templateUrl: './input-number.element.component.html',
  styleUrls: ['./input-number.element.component.sass']
})
export class InputNumberComponent {
  @Input() data: any;
}
