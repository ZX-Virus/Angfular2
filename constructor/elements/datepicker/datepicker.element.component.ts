import {
  Component,
  Input
} from '@angular/core';

import { IMyDpOptions } from 'mydatepicker';

@Component({
  moduleId: module.id,
  selector: 'datepicker-element',
  templateUrl: './datepicker.element.component.html',
  styleUrls: ['./datepicker.element.component.sass']
})
export class DatepickerElementComponent {
  @Input() data: any;

  private myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd.mm.yyyy',
  };

  // Initialized to specific date (09.10.2018).
  private model: Object = { date: { year: 2018, month: 10, day: 9 } };
}
