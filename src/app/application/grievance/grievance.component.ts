import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-grievance',
  templateUrl: './grievance.component.html',
  styleUrls: ['./grievance.component.scss']
})
export class GrievanceComponent implements OnInit {

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('Grievance');

  }

}
