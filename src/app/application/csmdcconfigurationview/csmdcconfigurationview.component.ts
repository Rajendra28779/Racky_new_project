import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DcconfigurationService } from '../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { NavigationExtras, Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { TableUtil } from '../util/TableUtil';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DcCdmomappingService } from '../Services/dc-cdmomapping.service';

@Component({
  selector: 'app-csmdcconfigurationview',
  templateUrl: './csmdcconfigurationview.component.html',
  styleUrls: ['./csmdcconfigurationview.component.scss']
})
export class CsmdcconfigurationviewComponent implements OnInit {
  user: any;
  dcUserId: any;
  txtsearchDate: any;
  datas: any
  hospitalArray: any;
  hosp: any;
  hospObj: any;
  currentPage: any;
  pageElement: any;
  keyword: any = 'fullName';
  hospList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public csmdcList: any = [];
  showPegi: boolean = false;
  group:any="";

  constructor(public fb: FormBuilder, private dcService: DcconfigurationService,
    private dccdmoService: DcCdmomappingService,
    private snoService: SnocreateserviceService, public headerService: HeaderService,
    private route: Router, private sessionService: SessionStorageService) {
  }

  ngOnInit(): void {
    this.headerService.setTitle('CSM-DC Or TSU Mapping');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    this.getStateList();
    this.setCsmDcConfigurationview();
  }

  getuserDetailsbygroup(groupid:any) {
    this.dccdmoService.getuserDetailsbygroup(groupid).subscribe(
      (response:any) => {
        this.csmdcList = response.data;
      },
      (error) => console.log(error)
    )
  }

  getCSMDCList() {
    this.dcService.getCSMDCDetails().subscribe(
      (response) => {
        this.csmdcList = response;
      },
      (error) => console.log(error)
    )
  }


  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $("#districtId").val("");
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  OnChangeDistrict(id) {
    var stateCode = localStorage.getItem("stateCode");
    this.snoService.getHospitalbyDistrictId(id, stateCode).subscribe(
      (response) => {

        this.hospitalList = response;
      },
      (error) => console.log(error)
    )
  }
  dcUserName: any ="All";
  selectEvent(item) {
    this.dcUserId = item.userId;
    this.dcUserName = item.fullName;
  }

  clearEvent() {
    this.dcUserId = '';
    this.setCsmDcConfigurationview();
  }
  count: any;
  viewlist: any = [];
  setCsmDcConfigurationview() {
    let dcId = this.dcUserId;
    let statecode = $('#stateId').val();
    let distcode = $('#districtId').val();
    let hospitalCode = $('#codehospital').val();
    dcId = dcId ?? '';
    statecode = statecode ?? '';
    distcode = distcode ?? '';
    hospitalCode = hospitalCode ?? '';
    this.dcService.saveCSMDCConfigurationLogview(dcId, statecode, distcode, hospitalCode, this.user.userId,this.group).subscribe((res: any) => {
      if (res.status == 'success') {
        let details = JSON.parse(res.details);
        this.viewlist = details.data;
        this.count = this.viewlist.length;
        if (this.count > 0) {
          this.showPegi = true
        } else {
          this.showPegi = false
        }
      }
    })
  }
  onReset() {
    window.location.reload();
  }
  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        dcId: item
      }
    };
    this.route.navigate(['/application/csmDCConfigurationAdd'], objToSend);
  }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  report: any = [];
  heading1 = [['Sl No', 'Assigned Full Name', 'Hospital Code', 'Hospital Name', 'State Name', 'District Name', 'Empanelment Status', 'MOU Status', 'Latitude', 'Longitude']];
  downloadReport(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let item: any;

    for (let i = 0; i < this.viewlist.length; i++) {
      item = this.viewlist[i];
      let row = [];
      row.push(i + 1);
      row.push(item.fullname);
      row.push(item.hospitalcode);
      row.push(item.hospitalname);
      row.push(item.hospitalstate);
      row.push(item.hospitaldistrict);
      row.push(item.empstatus);
      row.push(item.moustatus);
      row.push(item.latitude);
      row.push(item.longitude);
      this.report.push(row);
    }

    let statename = 'All';
    let distname = 'All';
    let hospital = 'All';

    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == $('#stateId').val()) {
        statename = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == $('#districtId').val()) {
        distname = this.districtList[j].districtname;
      }
    }

    for (let j = 0; j < this.hospitalList.length; j++) {
      if (this.hospitalList[j].hospitalCode == $('#codehospital').val()) {
        hospital = this.hospitalList[j].hospName+" ("+this.hospitalList[j].hospitalCode+")";
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Group Type', this.group==22?'CSM DC':this.group==10?'TSU':this.group==20?'SHAS TSU':'ALL']]);
      filter.push([['Full Name', this.dcUserName]]);
      filter.push([['State Name', statename]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospital]]);
      TableUtil.exportListToExcelWithFilter(this.report, 'CSM-DC/TSU Mapping View', this.heading1, filter);
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(18);
      doc.text("CSM-DC/TSU Mapping View", 70, 15);
      doc.setFontSize(13);
      doc.text('Group Type: '+( this.group==22?'CSM DC':this.group==10?'TSU':this.group==20?'SHAS TSU':'ALL'), 140, 25);
      doc.text('Full Name: ' + this.dcUserName, 15, 25);
      doc.text('State Name: ' + statename, 15, 32);
      doc.text('District Name: ' + distname, 140, 32);
      doc.text('Hospital Name: ' + hospital, 15, 39);
      doc.text('Generated By: ' + generatedBy, 15, 46);
      doc.text('Generated On: ' + generatedOn, 15, 53);
      autoTable(doc, {
        head: this.heading1,
        body: this.report,
        theme: 'grid',
        startY: 57,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('CSM-DC/TSU Mapping View.pdf');
    }
  }
}
