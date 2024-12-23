import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HeaderService } from '../header.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from '@angular/common';
import { filter } from 'rxjs/operators';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-surgical-medical-mapping',
  templateUrl: './surgical-medical-mapping.component.html',
  styleUrls: ['./surgical-medical-mapping.component.scss']
})
export class SurgicalMedicalMappingComponent implements OnInit {
  speciality: FormGroup;
  packageheadercode: any;
  packagesubcategor: any;
  procedurecode: any;
  type: any;
  packageheadercodedetails: any = [];
  record: any;
  pageElement: any;
  currentPage: any;
  user: any;
  txtsearchDate: any;
  typehidestatus: boolean = false;
  constructor(public fb: FormBuilder, public headerService: HeaderService, private route: Router, public activeroute: ActivatedRoute,
    public packageDetailsMasterService: PackageDetailsMasterService, private jwtService: JwtService, private sessionService: SessionStorageService) { }
  ngOnInit(): void {
    this.headerService.setTitle("Surgical Medical Mapping");
    this.user = this.sessionService.decryptSessionData("user");
    this.speciality = this.fb.group({
      packageHeaderCode: new FormControl(''),
      packageSubcategor: new FormControl(''),
      procedureCode: new FormControl(''),
      type: new FormControl(''),
      serachtype: new FormControl(0),
    })
    // $('#type').hide();
    this.getpackgaeheadercode();
  }
  getpackgaeheadercode() {
    this.packageheadercodedetails = [];
    this.packageDetailsMasterService.getpackgaeheadercode().subscribe((res: any) => {
      this.packageheadercodedetails = res;
    })
  }
  packageheadercodeval: any;
  packagesubcategorycodedetails: any = [];
  onChangeHeaderName(event) {
    this.packageheadercodeval = event;
    if (this.packageheadercodeval != null && this.packageheadercodeval != undefined && this.packageheadercodeval != "") {
      this.packageDetailsMasterService.getpackgaesubcategorycode(this.packageheadercodeval).subscribe((res: any) => {
        this.packagesubcategorycodedetails = res;
        this.getviewlist();
      }, (err: any) => {
        console.log(err);
      })
    } else {
      this.packagesubcategorycodedetails = [];
      $('#allCheck').prop('checked', false);
      this.reset();
    }
    this.getviewlist();
  }
  packagesubcode: any;
  procedurecodedata: any = [];
  length: any;
  onChangeSubcategory(event) {
    $('#allCheck').prop('checked', false);
    this.procedurecodedata = [];
    if (event != null && event != undefined && event != "") {
      for (let i = 0; i < this.packagesubcategorycodedetails.length; i++) {
        if (this.packagesubcategorycodedetails[i].packagesubcode == event) {
          this.packagesubcode = this.packagesubcategorycodedetails[i].packagesubcode;
        }
      }
    } else {
      this.packagesubcode = '';
      $('#allCheck').prop('checked', false);
    }
    if (this.packagesubcode != null && this.packagesubcode != undefined && this.packagesubcode != "") {
      this.packageDetailsMasterService.getprocedurecode(this.packagesubcode).subscribe((res: any) => {
        this.procedurecodedata = res;
        this.length = this.procedurecodedata.length;
        this.getviewlist();
      }, (err: any) => {
        console.log(err);
      })
    } else {
      this.procedurecodedata = [];
      this.packagesubcode = '';
      $('#allCheck').prop('checked', false);
      this.getviewlist();
    }
  }
  onChangeprocedurecode(event) {
    $('#allCheck').prop('checked', false);
    if (event != null && event != undefined && event != "") {
      for (let i = 0; i < this.procedurecodedata.length; i++) {
        if (this.procedurecodedata[i].procedurecode == event) {
          this.procedurecode = this.procedurecodedata[i].procedurecode;
          this.getviewlist();
        }
      }
    } else {
      this.procedurecode = '';
      this.getviewlist();
      $('#allCheck').prop('checked', false);
    }
  }
  viewdata: any = [];
  getviewlist() {
    let packageheadercodeval = this.packageheadercodeval;
    let packagesubcode = this.packagesubcode;
    let procedurecode = this.procedurecode;
    let searchtype = this.speciality.get('serachtype').value;
    if (packageheadercodeval == null || packageheadercodeval == undefined || packageheadercodeval == "") {
      packageheadercodeval = ''
    } if (packagesubcode == null || packagesubcode == undefined || packagesubcode == "") {
      packagesubcode = ''
    } if (procedurecode == null || procedurecode == undefined || procedurecode == "") {
      procedurecode = ''
    }
    this.packageDetailsMasterService.getviewlist(packageheadercodeval, packagesubcode, procedurecode, searchtype).subscribe((res: any) => {
      this.viewdata = res;
      this.record = this.viewdata.length;
      if (this.viewdata.length == 0) {
        this.viewdata = [];
      } else {
        this.viewdata = res;
        this.typehidestatus = true;
        // $('#type').show();

      }
    }
      , (err: any) => {
        console.log(err);
      })
  }
  savespeciality() {
    this.packageheadercode = this.speciality.get('packageHeaderCode').value;
    this.packagesubcategor = this.speciality.get('packageSubcategor').value;
    this.procedurecode = this.speciality.get('procedureCode').value;
    this.type = $('#typee').val();
    if (this.packageheadercode == null || this.packageheadercode == undefined || this.packageheadercode == "") {
      this.swal("Info", "Please Select Package Header", 'info');
      $("#packageHeaderCode").focus();
      return;
    } if (this.type == null || this.type == undefined || this.type == "") {
      this.swal("Info", "Please Select Type", 'info');
      $("#type").focus();
      return;
    }
    let data = {
      "packageheadercode": this.packageheadercode,
      "packagesubcategor": this.packagesubcategor,
      "procedurecode": this.procedurecode,
      "dataIdArray": this.dataIdArray,
      "procedurecodeArray": this.procedurecodeArray,
      "type": this.type,
      "userid": this.user.userId
    }
    Swal.fire({
      title: 'Are You Sure Want To Submit?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.packageDetailsMasterService.savespeciality(data).subscribe((res: any) => {
          if (res.status == "Success") {
            Swal.fire({
              title: res.message,
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'ok',
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.reload();
              } else {
                window.location.reload();
              }
            }
            );
          } else {
            this.swal("error", "Something Went Wrong", 'error');
          }
        })
      }
    })
  }
  reset() {
    window.location.reload();
  }
  serachtype: Number;
  getserachtype(type: Number) {
    this.serachtype = type;
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  dataIdArray: any = [];
  procedurecodeArray: any = [];
  show: boolean = false;
  checkAllCheckBox(event: any) {
    if (event.target.checked == true) {
      for (let i = 0; i < this.viewdata.length; i++) {
        $('#' + this.viewdata[i].id).prop('checked', true);
        this.dataIdArray.push(this.viewdata[i].id);
        this.procedurecodeArray.push(this.viewdata[i].procedurecode);
      }
    } else {
      for (let i = 0; i < this.viewdata.length; i++) {
        $('#' + this.viewdata[i].id).prop('checked', false);
        this.dataIdArray = [];
        this.procedurecodeArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
  }
  tdCheck(event: any, id, procedurecode: any) {
    if (event.target.checked) {
      this.dataIdArray.push(id);
      this.procedurecodeArray.push(procedurecode);
    } else {
      for (let i = 0; i < this.viewdata.length; i++) {
        if (this.dataIdArray[i] == id) {
          this.dataIdArray.splice(i, 1);
        }
        if (this.dataIdArray[i] == procedurecode) {
          this.procedurecodeArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.viewdata.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.show = true;
    } else {
      this.show = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }
  report: any = [];
  sno: any = {
    Slno: "",
    PackageHeaderCode: "",
    PackageSubcategoryName: "",
    ProcedureCode: "",
    PreauthRequired: "",
    MaximumDays: "",
    MandatoryDocumentsForPreAuthorization: "",
    MandatoryDocumentsForClaimProcessing: "",
    PackageExtention: "",
    PriceEditable: "",
    PackageUnderException: "",
    SurgicalType: "",
  };
  heading = [['Sl#', 'Package Header Code', 'Package Subcategory Name', 'Procedure Code', 'Preauth Required',
    'Maximum Days', 'Mandatory Documents For Pre-Authorization', 'Mandatory Documents For ClaimProcessing',
    'Package Extention',
    'Price Editable', 'Package Under Exception', 'Surgical Type']];
  downloadReport(type: any) {
    this.report = [];
    if (type == 'excel') {
      let claim: any;
      for (var i = 0; i < this.viewdata.length; i++) {
        claim = this.viewdata[i];
        this.sno = [];
        this.sno.Slno = i + 1;
        this.sno.PackageHeaderCode = claim.packageheader;
        this.sno.PackageSubcategoryName = claim.subpackagename;
        this.sno.ProcedureCode = claim.procedurecode;
        this.sno.PreauthRequired = claim.mandatorypreauth;
        this.sno.MaximumDays = claim.maximumdays;
        this.sno.MandatoryDocumentsForPreAuthorization = claim.preauthdocs;
        this.sno.MandatoryDocumentsForClaimProcessing = claim.claimprocesseddocs;
        this.sno.PackageExtention = claim.packageextention;
        this.sno.PriceEditable = claim.priceeditable;
        this.sno.PackageUnderException = claim.packageexceptionflag;
        this.sno.SurgicalType = claim.surgicaltype;
        this.report.push(this.sno);
      }
      let filter1 = [];
      filter1.push([['Package Header:-', this.packageheadercodeval]]);
      if (this.packagesubcode != null && this.packagesubcode != undefined && this.packagesubcode != "") {
        filter1.push([['Package Subcategory:-', this.packagesubcode]]);
      } else {
        filter1.push([['Package Subcategory:-', 'N/A']]);
      }
      if (this.procedurecode != null && this.procedurecode != undefined && this.procedurecode != "") {
        filter1.push([['Procedure Code:-', this.procedurecode]]);
      } else {
        filter1.push([['Procedure Code:-', 'N/A']]);
      } if (this.speciality.get('serachtype').value == 0) {
        filter1.push([['Search Type:-', "All"]]);
      } else if (this.speciality.get('serachtype').value == 1) {
        filter1.push([['Search Type:-', "Surgical"]]);
      } else if (this.speciality.get('serachtype').value == 2) {
        filter1.push([['Search Type:-', "Medical"]]);
      } else if (this.speciality.get('serachtype').value == 3) {
        filter1.push([['Search Type:-', "Not Tagged"]]);
      } else {
        filter1.push([['Search Type:-', "All"]]);
      }
      TableUtil.exportListToExcelWithFilterforadmin(this.report, "Surgical Medical Mapping", this.heading, filter1);
    } else if (type == 'pdf') {
      if (this.viewdata.length == 0) {
        this.swal('', 'No Data Found', 'info');
        return;
      }
      let SlNo = 1;
      this.viewdata.forEach(element => {
        let rowData = [];
        rowData.push(SlNo++);
        rowData.push(element.packageheader);
        rowData.push(element.subpackagename);
        rowData.push(element.procedurecode);
        rowData.push(element.mandatorypreauth);
        rowData.push(element.maximumdays);
        rowData.push(element.preauthdocs);
        rowData.push(element.claimprocesseddocs);
        rowData.push(element.packageextention);
        rowData.push(element.priceeditable);
        rowData.push(element.packageexceptionflag);
        rowData.push(element.surgicaltype);
        this.report.push(rowData);
      });
      let doc = new jsPDF('l', 'mm', [238, 270]);
      doc.setFontSize(10);
      doc.text('Authority Name:-' + this.user.fullName, 5, 5);
      doc.text('Package Header:-' + this.packageheadercodeval, 5, 10);
      if (this.packagesubcode != null && this.packagesubcode != undefined && this.packagesubcode != "") {
        doc.text('Package Subcategory:-' + this.packagesubcode, 5, 15);
      } else {
        doc.text('Package Subcategory:-' + 'N/A', 5, 15);
      }
      if (this.packagesubcode != null && this.packagesubcode != undefined && this.packagesubcode != "") {
        doc.text('Procedure Code:-' + this.procedurecode, 5, 20);
      } else {
        doc.text('Procedure Code:-' + 'N/A', 5, 20);
      }
      if (this.speciality.get('serachtype').value == 0) {
        doc.text('Search Type:-' + "All", 5, 25);
      } else if (this.speciality.get('serachtype').value == 1) {
        doc.text('Search Type:-' + "Surgical", 5, 25);
      } else if (this.speciality.get('serachtype').value == 2) {
        doc.text('Search Type:-' + "Medical", 5, 25);
      } else if (this.speciality.get('serachtype').value == 3) {
        doc.text('Search Type:-' + "Not Tagged", 5, 25);
      } else {
        doc.text('Search Type:-' + "All", 5, 25);
      }
      doc.text('Document Generate Date :-' + formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en').toString(), 5, 30);
      doc.text('Surgical Medical Mapping', 100, 31);
      doc.setLineWidth(0.7);
      doc.line(100, 32, 141, 32);
      autoTable(doc, {
        head: this.heading, body: this.report, startY: 33, theme: 'grid',
        styles: { overflow: 'linebreak', halign: 'center', valign: 'middle', fontSize: 8, cellPadding: 1, lineWidth: 0.1, lineColor: 0, textColor: 20 },
        bodyStyles: { lineWidth: 0.1, lineColor: 0, textColor: 20 },
        headStyles: { lineWidth: 0.1, lineColor: 0, textColor: [255, 255, 255], fillColor: [26, 99, 54] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 15 },
          2: { cellWidth: 15 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 },
          5: { cellWidth: 15 },
          6: { cellWidth: 45 },
          7: { cellWidth: 45 },
          8: { cellWidth: 15 },
          9: { cellWidth: 15 },
          10: { cellWidth: 15 },
          11: { cellWidth: 18 },
        }
      })
      doc.save('Surgical_Medical_Mapping.pdf');
    }
  }
  getdetails(procedureCode: any) {
    let state = {
      "Procedurecode": procedureCode
    }
    localStorage.setItem("speciality", JSON.stringify(state));
    localStorage.setItem("token", this.jwtService.getJwtToken())
    this.route.navigate([]).then(result => { window.open(environment.routingUrl + '/packagedetails'); });
  }
  getrest() {
    // window.location.reload();
    this.serachtype;
  }
}
