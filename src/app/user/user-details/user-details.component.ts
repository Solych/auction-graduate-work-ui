import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../shared/helper.service';
import {ThingService} from '../../shared/thing.service';
import {Thing} from '../../shared/model/Thing';
import {CountCategory} from '../../shared/model/CountCategory';
import * as _ from 'lodash';
import {Overrides} from '../../shared/model/Overrides';
import {notFoundAnyOverrides, severityInfo} from '../../constants/Constants';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.less']
})
export class UserDetailsComponent implements OnInit {
  lots: Thing[];
  countsCategory: any;
  colors: string[];
  wantSeeGraphOfLot: boolean;
  data: any;
  constructor(private helperService: HelperService, private thingService: ThingService) {
    this.wantSeeGraphOfLot = false;
    this.colors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c',
      '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075',
      '#808080', '#ffffff', '#000000'];
  }

  ngOnInit() {
    this.thingService.getThingsByOwner(this.helperService.getOwnerIdFromStorage()).subscribe((data: Thing[]) => {
      this.lots = data;
    });
    this.thingService.getDataOfCategories(this.helperService.getOwnerIdFromStorage()).subscribe((data: CountCategory[]) => {
      this.countsCategory = this.modifyDataToChart(data);
    });
  }

  loadDataForImage(thingId: number) {
    this.thingService.getOverrides(thingId).subscribe((data: Overrides[]) => {
      if (!data.length) {
        this.wantSeeGraphOfLot = false;
        this.helperService.showMsg(severityInfo, notFoundAnyOverrides);
        return;
      }
      this.data = this.modifyDataToLineChart(data);
      this.wantSeeGraphOfLot = true;
    });
  }

  private modifyDataToChart(data: CountCategory[]) {
    return {
      datasets: [{
        data: _.map(data, 'counts'),
        backgroundColor: this.colors.slice(0, data.length),
        label: 'График выставленных лотов и категорий'
      }],
        labels: _.map(data, 'cname')
    };
  }

  private modifyDataToLineChart(data: Overrides[]) {
    return {
      labels: _.map(data, 'name'),
      datasets: [
        {
          label: 'Ставки на лот',
          data: _.map(data, 'price'),
          fill: false,
          borderColor: '#0373b5'
        }
      ]
    };
  }
}
