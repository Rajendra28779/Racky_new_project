import { Component, OnInit, ViewChild } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import { NavigationExtras, Router } from '@angular/router';

import { HeaderService } from 'src/app/application/header.service';

import { SnoconfigpipePipe } from 'src/app/application/pipes/snoconfigpipe.pipe';

import { CDMOconfigurationServiceService } from 'src/app/application/Services/cdmoconfiguration-service.service';

import { DcconfigurationService } from 'src/app/application/Services/dcconfiguration.service';

import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';

import { TableUtil } from 'src/app/application/util/TableUtil';

import Swal from 'sweetalert2';



@Component({

  selector: 'app-cdmoconfigurationdetails',

  templateUrl: './cdmoconfigurationdetails.component.html',

  styleUrls: ['./cdmoconfigurationdetails.component.scss']

})

export class CdmoconfigurationdetailsComponent implements OnInit {

  txtsearchDate:any;

  record:any;

  currentPage: any;

  pageElement: any;

  showPegi: boolean;

  user: any;

  packageData: any = [];

  deleteDetails: any;

  status: any;

  id:any;

  cdmoData:any;





  constructor(private cdmoService: CDMOconfigurationServiceService,private route: Router, public headerService: HeaderService) { }





  ngOnInit(): void {

    this.headerService.setTitle("View CDMO Configuration");

    this.currentPage = 1;

    this.pageElement = 100;

    // this.getStateList();

     this.getCdmoDetails();



  }

  getCdmoDetails(){

this.cdmoService.getlist().subscribe((allData) => {

  this.cdmoData = allData;


  this.record = this.cdmoData.length;

  if (this.record > 0) {

    this.showPegi = true;

  }

  else {

    this.showPegi = false;

  }

})

}















edit(item: any) {

  let navigateExtras: NavigationExtras = {

    state: {

      id: item.mappingId,

      cdmoid:item.cdmoUserId,

      state:item.stateCode,

      dist:item.districtCode,

      status:item.status

    }

  };

  this.route.navigate(['application/cdmoConfiguration'], navigateExtras)

}



onPageBoundsCorrection(number: number) {

  this.currentPage = number;

}

pageItemChange() {

this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;

}

}
