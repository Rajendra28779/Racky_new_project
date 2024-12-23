import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WardMasterService } from '../../Services/ward-master.service';
import { WardDetailsMasterService } from '../../Services/ward-details-master.service';

@Component({
  selector: 'app-warddetails-view',
  templateUrl: './warddetails-view.component.html',
  styleUrls: ['./warddetails-view.component.scss']
})
export class WarddetailsViewComponent implements OnInit {
  warddetailsView:any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  constructor(public headerService: HeaderService,
    public wardMasterService: WardMasterService,
    public fb: FormBuilder,
    public router: Router,
    public wardDetailsMasterService: WardDetailsMasterService,
    private activeroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.headerService.setTitle('Ward Details Master');
    this. getAllWardDetails();
  }

  getAllWardDetails(){
    this.wardDetailsMasterService.getalldata().subscribe((data:any)=>{
      this.warddetailsView=data
      this.record = this.warddetailsView?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      }
    });
  }
  downloadList(){} 
}
