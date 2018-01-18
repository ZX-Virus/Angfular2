import {Component, Input} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'text-element',
  templateUrl: './text.element.component.html',
  styleUrls: ['./text.element.component.sass']
})
export class TextElementComponent {
  @Input() data: any;
}
