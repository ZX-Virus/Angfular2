import { Component, Input, OnInit } from '@angular/core';

import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'row-block',
  templateUrl: 'row-block.component.html',
  styleUrls: ['row-block.component.sass']
})
export class RowBlockComponent implements OnInit {
  @Input() data: any;

  constructor() {}

  initBlock(block) {
    if (block.props) {
      for (let j = 0; j < block.props.length; j++) {
        const prop = block.props[j];
        if (prop.elements) {
          for (let k = 0; k < prop.elements.length; k++) {
            const element = prop.elements[k];
            if ( element && element.type ) {
              element.eventProcessor = block.eventProcessor;
              element.vm = block.vm;
            }
          }
        }
      }
    }
  }

  ngOnInit() {
    var vm = this;

    if (vm.data) {
      for (let i = 0; i < vm.data.blocks.length; i++) {
        const block = vm.data.blocks[i];
        vm.initBlock( block );
      }

      if (vm.data.showMinimize) {
      }
    }

    this.data.deleteProp = this.deleteProp;
  }

  hideGrayContainer() {
    this.data.minimized = !this.data.minimized;
  }

  hideGrayContainerBlock(block) {
    block.minimized = !block.minimized;
  }

  deleteProp(block, i) {
    // поиск строки для удаления
    for (let k = 0; k < block.props.length; k++)
      if ( block.props[k] && (block.props[k].tag === i) ) {
        block.props.splice(k, 1);
        k--;
      }
  }

  createNewRow( numTag, block, elements, addDelete ) {
    let row = {
      elements: [],
      tag: numTag,
      outputParamPathName: undefined
    }
    if (block.outputParamPathName)
      row.outputParamPathName = block.outputParamPathName;

    for (let i = 0; i < elements.length; i++) {
      row.elements.push(
        JSON.parse(
          JSON.stringify(
            elements[i]
          )
        )
      );
    }

    if (addDelete)
      row.elements.push(
        {
          type: 'Button',
          mode: 'del',
          tag: {
            fn: this.deleteProp,
            block: block,
            numTag: numTag
          },
          width: '20px'
        }
      );
    return row;
  }

  addTemplate(block) {
    block.inArray = true;

    if (!block.props)
      block.props = [];

    const numTag = block.props.length;
    switch (block.templateMode) {
      case 'props':
        let addDelete = true;
        for (let i = 0; i < block.template.length; i++) {
          let row = this.createNewRow( numTag, block, block.template[i].elements, addDelete );
          block.props.push(row);
          addDelete = false;
        }
        break;
      default:
        let row = this.createNewRow( numTag, block, block.template, true );
        block.props.push(row);
    } // end switch
    this.initBlock(block);
  }

  addTemplateRow( row, block, index ) {
    if (!block.props)
      block.props = [];

    const findStr = 'row_' + row.templateId;
    const numTag = findStr + '_' + block.props.length;
    let newRow = this.createNewRow( numTag, block, row.template, true );

    // ищем в следующих блоках
    let findIndex = index;
    for (let i = index + 1; i < block.props.length; i++) {
      if (block.props[i].tag && ( block.props[i].tag.indexOf(findStr) === 0 ) ) {
        findIndex = i;
      }
    }
    block.props.splice(findIndex + 1, 0, newRow);
  }
}
