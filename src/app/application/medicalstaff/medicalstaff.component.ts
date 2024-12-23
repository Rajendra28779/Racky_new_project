import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-medicalstaff',
  templateUrl: './medicalstaff.component.html',
  styleUrls: ['./medicalstaff.component.scss']
})
export class MedicalstaffComponent implements OnInit {

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {

    this.headerService.setTitle('Medical staff');
    
  }

}
