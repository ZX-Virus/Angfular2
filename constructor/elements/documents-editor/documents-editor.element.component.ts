import {
  Component,
  Input,
  OnInit,
  ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import * as $ from 'jquery';

import { DocumentModalComponent } from './documents-modal/documents-modal.component'

@Component({
  moduleId: module.id,
  selector: 'documents-editor-element',
  templateUrl: './documents-editor.element.component.html',
  styleUrls: ['./documents-editor.element.component.sass']
})
export class DocumentsEditorElementComponent implements OnInit {
  @ViewChild('documentModal') documentModal: DocumentModalComponent;

  @Input() data: any;

  selectedDocument: any = {
    name: '',
    nameIssued: '',
    dateOff: '',
    imgName: ''
  };
  mode: any;
  editCopy: any;
  index: any;

  constructor(private http: Http) {}

  addDocument() {
    this.mode = 'add';
    const num = this.data.value.push({
      name: '',
      nameIssued: '',
      dateOff: '',
      imgName: ''
    });

    this.index = num - 1;
    this.selectedDocument = this.data.value[ this.index ];
    this.documentModal.show();
  }

  eventProcessor(vm, isSaved, item) {
    switch ( vm.mode ) {
      case 'add':
        if (isSaved)
          console.log('добавлен!');
        else {
          console.log('отмена добавления!');
          vm.data.value.splice(vm.index, 1);
        }
        break;
      case 'edit':
        if (isSaved)
          console.log('отредактирован!');
        else {
          console.log('отмена редактирования!');
          vm.data.value[ vm.index ] = JSON.parse(vm.editCopy);
        }
        break;
    }
  }

  editDocumentInModal( item, i ) {
    this.mode = 'edit';
    this.index = i;
    this.editCopy = JSON.stringify( item );
    this.selectedDocument = item;
    this.documentModal.show();
  }

  removeDocumentInModal(i) {
    this.index = i;
    this.data.value.splice(i, 1);
  }

  ngOnInit() {
    this.data.url = 'http://141.101.203.106:9000';
    this.data.eventProcessor = this.eventProcessor;
    this.data.vm = this;
    if (!this.data.value)
      this.data.value = [];
  }
}
