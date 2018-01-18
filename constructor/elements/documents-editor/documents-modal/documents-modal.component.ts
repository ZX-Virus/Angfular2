import {
  Component,
  Input,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';

import { QueryAPIService } from '../../../../shared/query-api.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'document-modal',
  templateUrl: './documents-modal.component.html',
  styleUrls: ['./documents-modal.component.sass']
})
export class DocumentModalComponent {
  @ViewChild('documentModal') public documentModal: ModalDirective;

  constructor(private queryAPIService: QueryAPIService, private router: Router) { }

  @Input() item: any;
  @Input() data: any;

  files: any;

  inputFileChange(e) {
    this.files = e.target.files || e.dataTransfer.files;
    if (!this.files[0].type.match('image.*'))
      this.files = undefined;
  }

  saveImage(isSaved) {
    let vm = this;

    if ( (this.data.vm.mode === 'edit') && (!this.files || !this.files.length) ) {
      vm.data.eventProcessor(vm.data.vm, isSaved, vm.item);
      return;
    }

    let fr = new FileReader(),
        file = this.files[0];
    fr.onload = (function(theFile) {
      return function(e) {
        let data = new FormData();
        data.append("0", file );
        data.append("q", "upload_img" );

        // Отправляем запрос
        $.ajax({
          url: vm.data.url + '/api/upload/img',
          type: 'POST',
          data: data,
          cache: false,
          dataType: 'json',
          processData: false, // Не обрабатываем файлы (Don't process the files)
          contentType: false, // Так jQuery скажет серверу что это строковой запрос
          success: function (respond, textStatus, jqXHR) {
            // Если все ОК
            if (typeof respond.error === 'undefined') {
              vm.item.imgName = respond.links[0].link;
              vm.data.eventProcessor(vm.data.vm, isSaved, vm.item);
            }
            else {
              vm.item.imgName = undefined;
              alert('ОШИБКИ ОТВЕТА сервера: ' + respond.error);
              vm.data.eventProcessor(vm.data.vm, isSaved, vm.item);
            }
          },
          error: function (jqXHR, textStatus, errorThrown) {
            vm.item.imgName = undefined;
            alert('ОШИБКИ AJAX запроса: ' + textStatus);
            vm.data.eventProcessor(vm.data.vm, isSaved, vm.item);
          }
        });
      };
    })(file);
    fr.readAsDataURL(file);
  }

  show() {
    this.documentModal.show();
  }
  hide( isSaved ) {
    if (isSaved)
      this.saveImage(isSaved);
    else
      this.data.eventProcessor(this.data.vm, isSaved, this.item);
    this.documentModal.hide();
    return isSaved;
  }
}
