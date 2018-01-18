import {
  Component,
  Input,
  ViewChild
} from '@angular/core';
import {Router} from '@angular/router';

import { QueryAPIService } from '../../../../shared/query-api.service';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'google-map-modal',
  templateUrl: 'google-map.component.html',
  styleUrls: ['google-map.component.sass']
})
export class GoogleMapModalComponent {
  @ViewChild('googleMapModal') public googleMapModal: ModalDirective;
  @Input() position: any;

  constructor(private queryAPIService: QueryAPIService, private router: Router) {}

  show() {
    this.googleMapModal.show();
  }
  hide() {
    this.googleMapModal.hide();
  }
}
