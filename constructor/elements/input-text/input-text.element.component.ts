import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'input-text-element',
  templateUrl: './input-text.element.component.html',
  styleUrls: ['./input-text.element.component.sass']
})
export class InputTextElementComponent implements OnInit {
  @Input() data: any;

  ngOnInit() {
    if (this.data.value == undefined) {
      this.data.value = '';
    }
  }
}
