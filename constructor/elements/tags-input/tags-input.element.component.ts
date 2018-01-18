import { Component, Input, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
    moduleId: module.id,
    selector: 'tags-input-element',
    templateUrl: './tags-input.element.component.html',
    styleUrls: ['./tags-input.element.component.sass']
})
export class TagsInputElementComponent implements AfterViewInit {
    @Input() data: any;
    randomId: string = Math.round( Math.random() * 10000000 ).toString();
    ngAfterViewInit() {
      setTimeout(() => {
            const filterAddTag = '<span class="add-texture-f"><p>Добавить</p></span>';
            const filterTagBlock = '<div class="filter-tag-block"></div>';
            $('#' + this.randomId + ' .bootstrap-tagsinput').append(filterTagBlock);
            $('#' + this.randomId + ' .bootstrap-tagsinput .filter-tag-block').append(filterAddTag);
        }, 300);
    }
}
