import {
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tree-element',
  templateUrl: './tree.element.component.html',
  styleUrls: ['./tree.element.component.sass']
})
export class TreeElementComponent implements OnInit {
  @Input() data: any;

  ngOnInit() {
    if (this.data.treeShow === undefined )
      this.data.treeShow = false;

    if (!this.data.value)
      this.data.value = {
        id: '',
        name: ''
      }

    if (!this.data.nameNode)
      this.data.nameNode = 'Категория: ';
    if (!this.data.nameNodeNotSelected)
      this.data.nameNodeNotSelected = 'Категория не выбрана';
  }

  activateTree(event) {
    if (!event.node.id) {
      this.data.value = {
        id: '',
        name: ''
      }
    }
      else
    {
      this.data.treeShow = false;
      this.data.value.id = event.node.id;
      this.data.value.name = event.node.displayField;
    }

    if (this.data.eventProcessor)
      this.data.eventProcessor({
        vm: this.data.vm,
        nameId: this.data.idElement
      })
  }
}
