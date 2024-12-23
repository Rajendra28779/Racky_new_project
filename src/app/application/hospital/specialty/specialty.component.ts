import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';

@Component({
  selector: 'app-specialty',
  templateUrl: './specialty.component.html',
  styleUrls: ['./specialty.component.scss']
})
export class SpecialtyComponent implements OnInit {

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('Specialty');

  }

}
