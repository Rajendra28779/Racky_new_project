import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getAllPackageDetails } from 'src/app/services/api-config';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { PackageDetailsMasterService } from '../../Services/package-details-master.service';
import { TableUtil } from '../../util/TableUtil';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { ClaimRaiseServiceService } from '../../Services/claim-raise-service.service';

@Component({
  selector: 'app-package-details-master-view',
  templateUrl: './package-details-master-view.component.html',
  styleUrls: ['./package-details-master-view.component.scss']
})
export class PackageDetailsMasterViewComponent implements OnInit {
  packageDetailList: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  textsearchData: any;
  record: any;

  constructor(public headerService: HeaderService, private route: Router, public activeroute: ActivatedRoute, public packageDetailsMasterService: PackageDetailsMasterService, private sessionService: SessionStorageService,private encryptionService: EncryptionService,
    private loginServ: ClaimRaiseServiceService
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle("View Package Details Master");
    this.currentPage = 1;
    this.pageElement = 100;
    this.getSchemeDetails();
    this.getAllPackageDetails();
    this.inclusionofsearchingforschemePackageData();
  }

  getAllPackageDetails() {
    let data = {
      'action' : 1,
      'category': this.category ? this.category : '',
      'packageheader' : this.packageHeaderCode? this.packageHeaderCode : '',
      'preauth' : this.preAuth?this.preAuth : '',
      'exp' : this.exp?this.exp : '',
      'packageType' : this.packageType?this.packageType : '',
    }
    this.packageDetailsMasterService.getPackageDetails(data).subscribe((res: any) => {
      this.packageDetailList = res;
      console.log(this.packageDetailList);
      this.record = this.packageDetailList.length;
      if (this.record > 0) {
        this.showPegi = true;
      } else {
        this.showPegi = false;
      }
      for (var i = 0; i < this.packageDetailList.length; i++) {
        var authCode = this.packageDetailList[i];
        // if (authCode.isPreAuthRequired == 'N') {
        //   authCode.isPreAuthRequired = "No"
        // }
        // if (authCode.isPreAuthRequired == 'Y') {
        //   authCode.isPreAuthRequired = "Yes"
        // }
        if (authCode.dayCare == 'N') {
          authCode.dayCare = "No"
        }
        if (authCode.dayCare == 'Y') {
          authCode.dayCare = "Yes"
        }
        // if (authCode.packageExtention == 'N') {
        //   authCode.packageExtention = "No"
        // }
        // if (authCode.packageExtention == 'Y') {
        //   authCode.packageExtention = "Yes"
        // }
        // if (authCode.priceEditable == 'N') {
        //   authCode.priceEditable = "No"
        // }
        // if (authCode.priceEditable == 'Y') {
        //   authCode.priceEditable = "Yes"
        // }
        // if (authCode.isPackageException == 'N') {
        //   authCode.isPackageException = "No"
        // }
        // if (authCode.isPackageException == 'Y') {
        //   authCode.isPackageException = "Yes"
        // }
      }
    });
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(id) {
    this.route.navigate(['/application/packageDetailsMaster', id])
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
        this.packageDetailsMasterService.deletePackageDetails(id).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.route.navigate(['/application/packageDetailsMasterView']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
          this.getAllPackageDetails();
        })

      }
    });
  }

  report: any = [];
  packageDetail: any = {
    Slno: "",
    packageHeaderCode: "",
    packagesubcategoryname: "",
    procedureCode: "",
    procedureDescription: "",
    mandatoryPreauth: "",
    packageCatagoryType: "",
    maximumDays: "",
    dayCare: "",
    stayType: "",
    preauthDocs: "",
    claimProcessDocs: "",
    packageExtention: "",
    priceEditable: "",
    isPackageException: "",
    isSurgical: "",
    extnofstay: ""
  };
  heading = [['Sl#', 'Package Header Code', 'Package Subcategory Name', 'Procedure Code', 'Procedure Description',
    'Preauth Required', 'Package Category Type', 'Maximum Days', 'Day Care', 'Fixed/Variable length of stay',
    'Mandatory Documents For Pre-Authorization', 'Mandatory Documents For Claim Processing', 'Package Extention',
    'Price Editable', 'Package Under Exception','Surgical/ Medical','Extension Of Stay Allow']];

  downloadList(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.packageDetailList.length; i++) {
      item = this.packageDetailList[i];
      this.packageDetail = [];
      this.packageDetail.slNo = i + 1;
      this.packageDetail.PackageHeaderCode = item.packageHeaderCode;
      this.packageDetail.PackageSubcatagoryName = item.packageSubcatagoryName;
      this.packageDetail.ProcedureCode = item.procedureCode;
      this.packageDetail.ProcedureDescription = item.procedureDescription;
      this.packageDetail.MandatoryPreauth = item.mandatoryPreauth;
      this.packageDetail.packageCatagoryType = item.packageCatagoryType;
      this.packageDetail.MaximumDays = item.maximumDays;
      if (item.dayCare != null) {
        this.packageDetail.DayCare = item.dayCare;
      } else {
        this.packageDetail.DayCare = 'N/A';
      }
      this.packageDetail.stayType = item.stayType;
      this.packageDetail.preauthDocs = item.preauthDocs;
      this.packageDetail.claimProcessDocs = item.claimProcessDocs;
      this.packageDetail.packageExtention = item.packageExtention;
      this.packageDetail.priceEditable = item.priceEditable;
      this.packageDetail.isPackageException = item.ispackageException;
      this.packageDetail.isSurgical = item.isSurgical;
      this.packageDetail.extnofstay = item.extnofstay;
      this.report.push(this.packageDetail);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(this.report, "View Package Details Master List", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [420, 360]);
      doc.setFontSize(23);
      doc.setFont('helvetica', 'bold');
      doc.text("View Package Details Master List", 150, 10);
      doc.setFontSize(16);
      doc.text("Generated On: " + this.convertDate(new Date()), 270, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 15, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.PackageHeaderCode;
        pdf[2] = clm.PackageSubcatagoryName;
        pdf[3] = clm.ProcedureCode;
        pdf[4] = clm.ProcedureDescription;
        pdf[5] = clm.MandatoryPreauth;
        pdf[6] = clm.packageCatagoryType;
        pdf[7] = clm.MaximumDays;
        pdf[8] = clm.DayCare;
        pdf[9] = clm.stayType;
        pdf[10] = clm.preauthDocs;
        pdf[11] = clm.claimProcessDocs;
        pdf[12] = clm.packageExtention;
        pdf[13] = clm.priceEditable;
        pdf[14] = clm.isPackageException;
        pdf[15] = clm.isSurgical;
        pdf[16] = clm.extnofstay;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 25 },
          2: { cellWidth: 35 },
          3: { cellWidth: 25 },
          4: { cellWidth: 30 },
          5: { cellWidth: 20 },
          6: { cellWidth: 25 },
          7: { cellWidth: 25 },
          8: { cellWidth: 20 },
          9: { cellWidth: 20 },
          10: { cellWidth: 20 },
          11: { cellWidth: 25 },
          12: { cellWidth: 25 },
          13: { cellWidth: 20 },
          14: { cellWidth: 20 }
        }
      });
      doc.save('View Package Details Master List.pdf');
    }
  }
  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
  packageschemename:any=[];
  category:any;
  setCategory(event: any) {
    this.category = event.target.value;
  }
  packageHeaderCode:any;
  setPackageHeader(event){
    this.packageHeaderCode  = event.target.value;
  }
  preAuth:any;
  setPreauthtype(event){
    this.preAuth = event.target.value;
  }
  exp:any;
  setException(event){
    this.exp = event.target.value;
  }
  incentive:any;
  setIncentive(event){
    this.incentive = event.target.value;
  }
  packageType:any;
  setPackageType(event){
    this.packageType = event.target.value;
  }
  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe((res: any) => {
      let resData = this.encryptionService.getDecryptedData(res);
      if (resData.status == 'success') {
        this.schemeList = resData.data;
      } else {
        this.swal('', 'Something went wrong.', 'error');

      }
    },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      });
  }
  inclusionofsearchingforschemePackageData() {
    let schemeid = 1;
    let schemecategoryid = this.category;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '' || schemecategoryid == "") {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.loginServ.InclusionofsearchingforschemePackageData(schemeid, schemecategoryid).subscribe(data => {
      if (data != null || data != '') {
        this.packageschemename = data;
      } else {
        Swal.fire('Error', 'Something went wrong.', 'error');
      }
    });
    console.log(this.packageschemename);

  }
  isFullRemark: boolean[] = []
  toggleRemark(index: number) {
    this.isFullRemark[index] = !this.isFullRemark[index];
  }
}



