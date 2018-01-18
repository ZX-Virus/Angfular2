import {
  Component,
  Input,
  AfterViewInit
} from '@angular/core';
import { NouisliderComponent } from 'ng2-nouislider';
import * as $ from 'jquery';


@Component({
  moduleId: module.id,
  selector: 'slider-input-element',
  templateUrl: './slider-input.element.component.html',
  styleUrls: ['./slider-input.element.component.sass']
})
export class SliderInputElementComponent implements AfterViewInit {
  @Input() data: any;

  onChange(event) {
    this.data.value[0] = event[0]
    this.data.value[1] = event[1]
  }
  ngAfterViewInit() {
  }
}
