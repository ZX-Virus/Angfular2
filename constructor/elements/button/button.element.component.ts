import {Component, Input} from '@angular/core';
import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'button-element',
  templateUrl: './button.element.component.html',
  styleUrls: ['./button.element.component.sass']
})
export class ButtonElementComponent {
  @Input() data: any;

  classStatus() {
    let classRes = '';
    if ( this.data.selected )
      classRes = 'btn-rose simple-btn'
    else {
      if ( this.data.disabled )
        classRes = 'btn btn-transparent company-reg-chi-btn'
      else
        classRes = 'btn btn-default company-reg-chi-btn'
    }
  }

  clickDelBtn() {
    if ( this.data.tag &&
         this.data.tag.fn &&
        (this.data.tag.numTag !== undefined) &&
         this.data.tag.block )
      this.data.tag.fn( this.data.tag.block, this.data.tag.numTag )
    else {
      if (this.data.eventProcessor && this.data.vm && this.data.idElement)
        this.data.eventProcessor(this.data.vm, this.data.idElement);
    }
  }
}
