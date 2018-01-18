import {Component, Input, AfterContentInit, OnInit} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import * as $ from 'jquery';

@Component({
  moduleId: module.id,
  selector: 'image-list-editor-element',
  templateUrl: './image-list-editor.element.component.html',
  styleUrls: ['./image-list-editor.element.component.sass']
})
export class ImageListEditorElementComponent implements AfterContentInit, OnInit {
  @Input() data: any;

  constructor (private http: Http) {};

  public ngAfterContentInit() {
  }

  showAddImage(editable, values, maxNumImages) {
    let res = false;
    if ( this.data.editable )
      res = true;
    if ( this.data.values && this.data.maxNumImages )
      res = (this.data.values.length < this.data.maxNumImages);

    return res;
  }

  public onDeleteClick(item) {
    let array = this.data.values,
        aItem;
    for (let i = 0; i < array.length; i++ ) {
      aItem = array[i];
      if (aItem) {
        if ((aItem.data64 === item.data64) || (aItem.name === item.name)) {
          if ( aItem.fromServer )
            aItem.removed = true;
          else
            array.splice(i, 1);
          return true;
        }
      }
    }

    return false;
  }

  public ngOnInit() {
    this.data.url = 'http://141.101.203.106:9000';
    this.data.vm = this;

    if (!this.data.values)
      this.data.values = [];

    if (this.data.value)
      this.data.value = this.data.value.map((item) => {
        return {
          data64: '',
          name: item.name,
          fromServer: true
        }
      })
  }

  public onFileChange(e) {
    const files = e.target.files || e.dataTransfer.files,
          vm = this;
    const imgs = this.data.values;
    for (let i = 0, f; f = files[i]; i++) {
      if (!f.type.match('image.*'))
        continue;
      let fr = new FileReader();
      fr.onload = (function(theFile) {
        return function(e) {
          const bInArray = (array, item) => {
            for (let i = 0; i < array.length; i++ ) {
              if ( array[i].data64 === item.data64 )
                return true;
            }
            return false;
          }
          const item = {
            data64: e.target.result,
            name: theFile.name
          };
          if ( !bInArray( imgs, item ) ) {
            let data = new FormData();
            data.append("0", f );
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
                if ( (typeof respond.error === 'undefined') && respond.links ) {
                  item.name = respond.links[0].link;
                  imgs.push(item);
                  vm.data.value = [];
                  for (let j = 0; j < imgs.length; j++ )
                    vm.data.value.push(respond.links[0].link);
                }
                else {
                  /*if ( respond.message && respond.message.length) {
                    alert('ОШИБКИ ОТВЕТА сервера: ' + respond.message[0].message);
                  }
                  else
                    alert('ОШИБКИ ОТВЕТА сервера: ' + respond.error);*/
                }
              },
              error: function (jqXHR, textStatus, errorThrown) {
                //alert('ОШИБКИ AJAX запроса: ' + textStatus);
              }
            });


          }
        };
      })(f);
      fr.readAsDataURL(f);
    }
  }
}
