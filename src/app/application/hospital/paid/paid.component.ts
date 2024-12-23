import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';

@Component({
  selector: 'app-paid',
  templateUrl: './paid.component.html',
  styleUrls: ['./paid.component.scss']
})
export class PaidComponent implements OnInit {

  constructor(public headerService:HeaderService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Paid Status');
  }

}
