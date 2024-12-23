import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent implements OnInit {

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('Query Status');

  }

}
