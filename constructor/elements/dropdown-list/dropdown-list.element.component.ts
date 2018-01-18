import {Component, Input, OnInit} from '@angular/core';

import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'dropdown-list-element',
  templateUrl: './dropdown-list.element.component.html',
  styleUrls: ['./dropdown-list.element.component.sass']
})
export class DropdownListElementComponent implements OnInit {
  @Input() data: any;

  filterStr: string = '';
  filteredList: any = [];

  filterChange(event) {
    if ( this.data.mode != 'DropInput' ) {
      this.filteredList = this.data.values
      return this.filteredList
    }

    if (this.data && this.data.values && this.data.values.length) {
      const filterStr: any = this.filterStr.toLowerCase();
      this.filteredList = this.data.values.filter((element, index, array) => {
        return (element.name.toLowerCase().indexOf(filterStr) >= 0);
      });
    }
      
  }

  selectItem(item) {
    this.data.value = item.id;
    if (!this.data.selectedItem)
      this.data.selectedItem = {};

    this.data.selectedItem.id = item.id;
    this.data.selectedItem.name = item.name;

    this.filterStr = item.name;

    if (this.data.eventProcessor && this.data.vm && this.data.idElement)
      this.data.eventProcessor(this.data.vm, this.data.idElement);
  }

  ngOnInit: any = () => {
    if (this.data.mode === 'withCheckBoxes') {
      let item: any;
      for (let i: number = 0; i < this.data.values.length; i++) {
        item = this.data.values[i];
        item.dataCheckbox = {
          checked: item.checked,
          addTooltip: item.addTooltip,
          TooltipPosition: item.TooltipPosition,
          TooltipTitle: item.TooltipTitle
        };
      }
    }
  }
}
