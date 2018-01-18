import {
  Component,
  Input,
  ViewChild,
  OnChanges, SimpleChanges
} from '@angular/core';

import { AdDirective } from './viewer-constructor.directive';
import { AdItem }      from './ad-item';
import { AdComponent } from './ad.component';
import { RowBlockComponent } from '../blocks/row-block.component';

import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'viewer-constructor',
  templateUrl: './viewer-constructor.component.html',
  styleUrls: ['./viewer-constructor.component.sass']
})
export class ViewerConstructorComponent implements OnChanges {
  @Input() viewStruct: any;
  @Input() importObject: any;
  @Input() exportObject: any;

  @ViewChild(AdDirective) adHost: AdDirective;

  Blocks: AdItem[];
  outFuncs: any;

  ReInit() {
    this.Blocks = [];
    if (this.viewStruct && this.viewStruct.form && this.viewStruct.form.length) {
      let block: any;
      for (let i = 0; i < this.viewStruct.form.length; i++) {
        block = this.viewStruct.form[i];
        if (block.blocks && block.blocks.length) {
          for (let j = 0; j < block.blocks.length; j++) {
            block.blocks[j].eventProcessor = this.viewStruct.eventProcessor;
            block.blocks[j].vm = this.viewStruct.vm;
          }
          this.Blocks.push(new AdItem(RowBlockComponent, {
            joint: block.joint,
            showMinimize: block.showMinimize,
            blocks: block.blocks
          }));
        }
        else {
          block.eventProcessor = this.viewStruct.eventProcessor;
          block.vm = this.viewStruct.vm;
          this.Blocks.push(new AdItem(RowBlockComponent, {
            joint: false,
            showMinimize: block.showMinimize,
            blocks: [block]
          }));
        }
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.ReInit();
  }

  private CreatePropertyAndValue(data, property, value, numArray) {
    const propertyPaths = property.split('.');
    let d = data,
        dArr: any;
    for (let i = 0; i < propertyPaths.length; i++) {
      // последний?
      if ( i === ( propertyPaths.length - 1 ) ) {
        if (numArray !== undefined) {
          /*dArr = dArr[ propertyPaths[i - 1] ];*/
          if (Object.prototype.toString.call( dArr[ propertyPaths[i - 1] ] ) != '[object Array]')
            dArr[ propertyPaths[i - 1] ] = [];
          if (!dArr[ propertyPaths[i - 1] ][numArray])
            dArr[ propertyPaths[i - 1] ][numArray] = {};
          dArr[ propertyPaths[i - 1] ][numArray][propertyPaths[i]] = value
        }
        else
          d[ propertyPaths[i] ] = value
      }
      else { // движение по объекту или создание путей
        // если существует
        if ( !d[propertyPaths[i]] ) {
          d[propertyPaths[i]] = {};
        }
        if (numArray !== undefined)
          dArr = d;
        d = d[propertyPaths[i]];
      }
    }
  }

  private AddInDataValue( data, element, numArray ) {
    if (element.outputParamPathName) {
      switch (element.type) {
        case 'DatePicker':
          if (element.value)
            this.CreatePropertyAndValue(data, element.outputParamPathName, element.value.formatted, numArray);
          else
            this.CreatePropertyAndValue(data, element.outputParamPathName, element.value, numArray);
          break;
        case 'CheckBox':
          this.CreatePropertyAndValue(data, element.outputParamPathName, element.checked, numArray);
          break;
        case 'ImageListEditor':
          if (element.values && element.values.length) {
            element.values_copy = JSON.parse(JSON.stringify(element.values));
            for (var i: number = 0; i < element.values_copy.length; i++)
              delete element.values_copy[i].data64;
            this.CreatePropertyAndValue(data, element.outputParamPathName, element.values_copy, numArray);
          }
          break;
        default:
          this.CreatePropertyAndValue(data, element.outputParamPathName, element.value, numArray);
      }
    }
  }

  public ImportData() {
    let blocks: any;
    let block: any;
    let prop: any;
    let element: any;
    let numArray: any;
    for (let i = 0; i < this.viewStruct.form.length; i++) {
      blocks = this.viewStruct.form[i];
      if (blocks.blocks && blocks.blocks.length)
        blocks = blocks.blocks;
      else
        blocks = [blocks];

      let numsArray = 0;
      for (let j = 0; j < blocks.length; j++) {
        block = blocks[j];
        numArray = undefined;
        if (block.props) {
          for (let k = 0; k < block.props.length; k++) {
            prop = block.props[k];

            // вычисление numArray для созданных template
            let num;
            if (block.inArray && (prop.tag !== undefined) ) {
              switch ( typeof(prop.tag) ) {
                case 'number': num = prop.tag;
                      break;
                case 'string': num = parseInt(prop.tag.replace(/\D+/g,  "" ), 10);
                  break;
              }
            }
            if (num !== undefined) {
              numArray = numsArray;
              numsArray++;
            }
            else
              numArray = undefined;

            if (prop.elements) {
              for (let l = 0; l < prop.elements.length; l++) {
                element = prop.elements[l];
                this.AddInDataValue(this.importObject, element, numArray);
              }
            }
          }
        }
      }
    }
  }

  /* Экспорт данных в конструктор */
  private checkPathNameAndGetValue( propertyPaths: any, exportObject: any, numArray: number, templateStatus: any ): any {
    let Obj: any = exportObject;
    for (var i: number = 0; i < propertyPaths.length; i++) {
      if (templateStatus) {
        if ((numArray !== undefined) && (i === (propertyPaths.length - 2))) {
          Obj = Obj[propertyPaths[i]];
          if ( Obj && Obj[numArray] && Obj[numArray][propertyPaths[i + 1]] ) {
            Obj = Obj[numArray][propertyPaths[i + 1]];
            templateStatus.templated = true;
          }
          else
            Obj = undefined;
          return Obj;
        }
        else
          Obj = Obj[propertyPaths[i]];
      }
      else
        Obj = Obj[propertyPaths[i]];

      if (!Obj)
        return;
    }
    return Obj;
  }

  private AddValueFromData( exportObject: any, element: any, numArray: number, templateStatus: any ): any {
    let res;
    const propertyPaths: any = element.outputParamPathName.split('.');
    if (propertyPaths && propertyPaths.length)
      switch (element.type) {
        case 'CheckBox':
          res = this.checkPathNameAndGetValue(propertyPaths,  exportObject, numArray, templateStatus);
          if (res)
            element.checked = res;
          break;
        case 'DropdownList':
          if (element.values && element.values.length) {
            element.value = this.checkPathNameAndGetValue(propertyPaths, exportObject, numArray, templateStatus);
            let selectedItem: any;
            for (let i: number = 0; i < element.values.length; i++) {
              if (element.values[i].id === element.value)
                selectedItem = element.values[i];
            }
            if (selectedItem)
              element.selectedItem = selectedItem;
          }
          break;
        case 'ImageListEditor':
          element.values = this.checkPathNameAndGetValue(propertyPaths,  exportObject, numArray, templateStatus);
          break;
        default:
          res = this.checkPathNameAndGetValue(propertyPaths,  exportObject, numArray, templateStatus);
          if (res)
            element.value = res;
      }
  }

  deleteProp(block, i) {
    // поиск строки для удаления
    for (let k = 0; k < block.props.length; k++)
      if ( block.props[k] && (block.props[k].tag === i) ) {
        block.props.splice(k, 1);
        k--;
      }
  }

  public ExportData( exportObject: any ): any {
    let blocks: any;
    let block: any;
    let prop: any;
    let element: any;
    let numArray: any;
    for (let i: number = 0; i < this.viewStruct.form.length; i++) {
      blocks = this.viewStruct.form[i];
      if (blocks.blocks && blocks.blocks.length)
        blocks = blocks.blocks;
      else
        blocks = [blocks];

      let numsArray: number = 0;
      for (let j: any = 0; j < blocks.length; j++) {
        block = blocks[j];

        numArray = undefined;
        if (block.props) {
          for (let k : any = 0; k < block.props.length; k++) {
            prop = block.props[k];
            if (!prop.tag) {
              if (prop.elements) {
                for (let l: any = 0; l < prop.elements.length; l++) {
                  element = prop.elements[l];
                  if (element.outputParamPathName && element.outputParamPathName.length)
                    this.AddValueFromData(exportObject, element, numArray, undefined);
                }
              }
            }
          }
        }

        if (block.template) {
          let template: any,
              templateStatus: any = {
                templated: false
              },
            templateNumArray: number = 0;
          do {
            templateStatus.templated = false;

            // создать копию tamplate если вдруг она нужна будет
            let copyTemplate: any = JSON.parse(JSON.stringify(block.template));

            // заполняем копию и определяем есть ли для неё циклические значения если есть - сигнализируем в resStatus.doubleMore
            let templateElement: any;
            for (let k : any = 0; k < copyTemplate.length; k++) {
              templateElement = copyTemplate[k];
              if (templateElement.outputParamPathName && templateElement.outputParamPathName.length)
                this.AddValueFromData( exportObject, templateElement, templateNumArray, templateStatus );
            }

            let exist: boolean = false;
            if (block && block.props) {
              for (let i: number = 0; i < block.props.length; i++) {
                if (block.props[i].tag === templateNumArray) {
                  exist = true;
                  templateStatus.templated = false;
                  break;
                }
              }
            }

            // если есть чтото легло в шаблон (), то создаем копию в конфигурацию
            if ( !exist && templateStatus.templated ) {
              copyTemplate.push({
                type: 'Button',
                mode: 'del',
                tag: {
                  fn: undefined,
                  numTag: templateNumArray,
                  block: undefined
                },
                width: '20px'
              });

              if (!block.props)
                block.props = [];
              let tprop = {
                elements: [],
                tag: templateNumArray
              }
              for (let m: number = 0; m < copyTemplate.length; m++) {
                let num: number = tprop.elements.push(
                  JSON.parse(JSON.stringify(copyTemplate[m]))
                );
              }
              block.props.push(
                JSON.parse(JSON.stringify(tprop))
              );
              block.props[block.props.length - 1].elements[copyTemplate.length - 1].tag.block = this.Blocks[i].data.blocks[j];
              block.props[block.props.length - 1].elements[copyTemplate.length - 1].tag.fn = this.Blocks[i].data.deleteProp;

              templateNumArray++;
            }
          } while ( templateStatus.templated );
        }
      }
    }
  }

}
