import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { HighEndDrugsService } from '../../Services/high-end-drugs.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-high-end-drugs-view',
  templateUrl: './high-end-drugs-view.component.html',
  styleUrls: ['./high-end-drugs-view.component.scss']
})
export class HighEndDrugsViewComponent implements OnInit {

  txtsearchData: any;
  highendDrugsdata: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;

  report: any[];
  hed: any = {
    Slno: '',
    // wardName:'',
    // implantCode:'',
   // implantName:'',
    drugCode:'',
    hedName:'',
    noOfunit:'',
    maximumUnitPrice:'',
    recomendedDose:'',
    ispreauthRequired:'',
    unitEditable:'',
    priceEditable:''
  };
  heading = [
    [
      'Sl#',
      // 'Ward Name',
      // 'Implant Code',
      'Drug Code',
      'HED Name',
      'No. Of Unit',
      'Maximum Unit Price',
      'Recomended Dose',
      'Ispreauth Required',
      'Unit Editable',
      'Price Editable'
    ],
  ];

  constructor(public headerService: HeaderService,
    private highEndDrugsService: HighEndDrugsService,
    public router: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('High End Drugs View');
    this.currentPage = 1;
    this.pageElement = 10;
    this.getAllHighEndDrugs();
  }

  getAllHighEndDrugs() {
    this.highEndDrugsService.getAllHighEndDrugs().subscribe((data: any) => {
      this.highendDrugsdata = data;
      this.record = this.highendDrugsdata.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
      for (var i = 0; i < this.highendDrugsdata.length; i++) {
        var authCode = this.highendDrugsdata[i];
        if (authCode.isPreAuthRequired == 'N') {
          authCode.isPreAuthRequired = "No"
        }
        if (authCode.isPreAuthRequired == 'Y') {
          authCode.isPreAuthRequired = "Yes"
        }
        if(authCode.unitEditable =='N'){
          authCode.unitEditable = "No"
        }
        if(authCode.unitEditable =='Y'){
          authCode.unitEditable = "Yes"
        }
        if(authCode.priceEditable =='N'){
          authCode.priceEditable = "No"
        }
        if(authCode.priceEditable =='Y'){
          authCode.priceEditable = "Yes"
        }
      }
    })
  }

  edit(id) {
    this.router.navigate(['/application/highEndDrugs', id])
  }
  delete(id) {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.highEndDrugsService.deleteHighEndDrugsById(id).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.router.navigate(['/application/highEndDrugsView']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
          this.getAllHighEndDrugs();
        })
      }
    })
  }
  downloadList(){
    this.report = [];
    let packageP:any;
    for (var i = 0; i < this.highendDrugsdata.length; i++) {
      packageP = this.highendDrugsdata[i];
      this.hed = [];
      this.hed.Slno = i + 1;
     // this.hed.implantName=packageP.implantDetailsId.implantName;
      // this.hed.wardName=packageP.wardCategoryId.wardName;
      // this.hed.implantCode=packageP.implantCode;
      this.hed.drugCode=packageP.hedCode;
      this.hed.hedName=packageP.hedName;
      this.hed.noOfunit=packageP.unit;
      this.hed.maximumUnitPrice=packageP.price;
      this.hed.recomendedDose=packageP.recomendedDose;
      this.hed.ispreauthRequired=packageP.isPreAuthRequired;
      this.hed.unitEditable=packageP.unitEditable;
      this.hed.priceEditable=packageP.priceEditable;
      this.report.push(this.hed);
    }
    TableUtil.exportListToExcel(
      this.report, 'High End Drugs', this.heading
    );
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
