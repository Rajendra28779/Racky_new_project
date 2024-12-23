import { Component, OnInit } from '@angular/core';
import { TreatementSupportUrnserviceService } from '../treatement-support-urnservice.service';

@Component({
  selector: 'app-tretement-support-urn-details',
  templateUrl: './tretement-support-urn-details.component.html',
  styleUrls: ['./tretement-support-urn-details.component.scss']
})
export class TretementSupportUrnDetailsComponent implements OnInit {
  dataClaim:any
  pageElement: any;
  currentPage: any;
  urndata: any = [];
  record: any;
  query:boolean=false;
  showPegi: boolean;
  constructor(public treatementSupportUrnserviceService:TreatementSupportUrnserviceService) { }

  ngOnInit(): void {
    this.dataClaim = JSON.parse(localStorage.getItem("urndata"));
    this.currentPage = 1;
    this.pageElement = 10;
    this.treatementSupportUrnserviceService.gettsu(this.dataClaim.URN).subscribe((data:any)=>{
      console.log(data);
      this.urndata=data;
      if (this.urndata.length == 0) {
        this.query=true;
      }
      this.record = this.urndata.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
    console.log(this.pageElement);
  }
}
