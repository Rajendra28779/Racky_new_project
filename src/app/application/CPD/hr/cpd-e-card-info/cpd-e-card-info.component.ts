import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../../header.service';

@Component({
  selector: 'app-cpd-e-card-info',
  templateUrl: './cpd-e-card-info.component.html',
  styleUrls: ['./cpd-e-card-info.component.scss']
})
export class CpdECardInfoComponent implements OnInit {

  constructor(public headerService: HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('CPD E-Card Info');

  }

}
