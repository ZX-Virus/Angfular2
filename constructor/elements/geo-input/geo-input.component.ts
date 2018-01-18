import {
  Component,
  Input,
  ViewChild,
  AfterContentInit,
  AfterViewInit,
  OnInit
} from '@angular/core';

import {Router} from '@angular/router';
import { QueryAPIService } from '../../../shared/query-api.service';
import { GoogleMapModalComponent } from './google-map/google-map.component';

import * as $ from 'jquery';

@Component({
  selector: 'geo-input-element',
  templateUrl: './geo-input.component.html',
  styleUrls: ['./geo-input.component.sass']
})

export class GeoInputFormComponent implements OnInit {
  @ViewChild('googleMapModal') public googleMapModal: GoogleMapModalComponent;

  @Input() data: any;

  selectedData: any;

  autoCompleteCallback1( selectedData: any ) {
    this.data.value = JSON.stringify( selectedData );
    /*  {
      lat: selectedData.geometry.location.lat,
      lng: selectedData.geometry.location.lng,
      address: selectedData.formatted_address
    } */
    this.selectedData = selectedData;
  }

  constructor(private queryAPIService: QueryAPIService, public router: Router) {}

  onClickGoogle(vm, idElement) {
    if (vm.data.value)
      vm.googleMapModal.show();
  }

  userSettings: any = {
    inputPlaceholderText: 'Введите улицу и дом',
    cbShowMap: this.onClickGoogle,
    cbShowMapVM: this,
    ptrOpts: {
      beforeLocationInput: '',
      disabled: true
    },
  }

  timerId: any;
  ngOnInit() {
    const vm = this;
    vm.timerId = setInterval(() => {
      vm.userSettings.ptrOpts.disabled = !( vm.data &&
        vm.data.country && vm.data.country.name && vm.data.country.name.length &&
        vm.data.region  && vm.data.region.name  && vm.data.region.name.length &&
        vm.data.city    && vm.data.city.name    && vm.data.city.name.length );
      if (!vm.userSettings.ptrOpts.disabled) {
        let addr = '';
        addr += vm.data.country.name + ', ';
        addr += vm.data.region.name + ', ';
        addr += vm.data.city.name + ', ';
        vm.userSettings.ptrOpts.beforeLocationInput = addr;
      }
    }, 500);
  }
  ngOnDestroy() {
    clearInterval(this.timerId);
  }
}
