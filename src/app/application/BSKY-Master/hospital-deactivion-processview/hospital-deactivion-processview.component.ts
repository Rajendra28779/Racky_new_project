import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { TableUtil } from '../../util/TableUtil';


@Component({
  selector: 'app-hospital-deactivion-processview',
  templateUrl: './hospital-deactivion-processview.component.html',
  styleUrls: ['./hospital-deactivion-processview.component.scss']
})
export class HospitalDeactivionProcessviewComponent implements OnInit {
  stateList: any = [];
  hospitalList: any = [];
  districtList: any = [];
  stateCode: any="";
  distCode: any="";
  keyword2 = "hospitalName";
  user:any;
  showPegi: boolean=false;
  currentPage: any;
  pageElement: any;
  count:any=0;
  txtsearchDate:any;
  list:any=[];
  districtCode: any;
  action:any=0;

  actiondata:any=[
    {
      id: 1,
      name: "Suspend",
      note: 'TMS Blocking Will be Blocked and CMS will Active.'
    },
    {
      id: 2,
      name: "De-Empanel",
      note: 'Both TMS and CMS Login will be Blocked.'
    }
  ]

  constructor(public headerService: HeaderService,
    private snoService: SnocreateserviceService,
    private qcadminServices: QcadminServicesService,
    private sessionService: SessionStorageService,
    private route:Router) { }

    ngOnInit(): void {
      this.headerService.setTitle("Hospital De-Empanel");
      this.user =  this.sessionService.decryptSessionData("user");
      this.getStateList();
      this.search();
    }

    Reset() {
      window.location.reload();
    }

    getStateList() {
      this.stateList = [];
      this.districtList = [];
      this.hospitalList = [];
      this.snoService.getStateList().subscribe(
        (response: any) => {
          this.stateList = response;
        },
        (error) => console.log(error)
      );
    }


    onChangeState(id) {
      this.stateCode=id;
      this.districtList = [];
      this.hospitalList = [];
      $('#districtId1').val("");
      this.snoService.getDistrictListByStateId(id).subscribe(
        (response: any) => {
          this.districtList = response;
        },
        (error) => console.log(error)
      );
    }

    onChangeDistrict(id) {
      this.hospitalList = [];
      this.snoService.getHospitalbyDistrictId(id, this.stateCode).subscribe(
        (response: any) => {
          this.hospitalList = response;
        },
        (error) => console.log(error)
      );
    }

    swal(title: any, text: any, icon: any) {
      Swal.fire({
        icon: icon,
        title: title,
        text: text,
      });
    }

  hospitalId:any='';
  hospitalname:any='';
  selectEvent2(item) {
    this.hospitalId = item.hospitalCode;
    this.hospitalname = item.hospitalName;
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
  }

  search(){
    this.stateCode=$('#stateId1').val();
    this.distCode=$('#districtId1').val();
    if(this.stateCode==null){this.stateCode="";}
    if(this.distCode==null){this.distCode="";}
    this.action=$('#action1').val();
    this.qcadminServices.getHospitalDeactivionview(this.stateCode,this.distCode,this.hospitalId,this.action).subscribe(
      (response: any) => {
        if(response.status == 200){
          this.list = response.data;
          this.count=this.list.length;
          if(this.count>0){
            this.showPegi = true
            this.currentPage = 1
            this.pageElement = 100
          }else{
            this.showPegi = false;
          }
        }else {
          this.swal('Error', 'Something Went Wrong', 'error');
        }
      });
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
  }

  logdetailslist:any=[];
  hospname:any;
  log(item:any){
    this.logdetailslist=[];
    this.hospname=item.hospitalName+" ("+item.hospitalCode+")";
    this.qcadminServices.getHospitalDeactivionlog(item.hospitalCode).subscribe(
      (response: any) => {
        if(response.status == 200){
          this.logdetailslist = response.data;
        }else {
          this.swal('Error', 'Something Went Wrong', 'error');
        }
      });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl#', 'State Name', 'District Name', 'Hospital Name','Hospital Code', 'Empanelment Status', 'Remark','Action By','Action On']];
  heading1 = [['Sl#','Empanelment Status', 'Remark','Action By','Action On']];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.statName);
      this.sno.push(sna.distName);
      this.sno.push(sna.hospitalName);
      this.sno.push(sna.hospitalCode);
      this.sno.push(sna.emastatus);
      this.sno.push(sna.remark);
      this.sno.push(sna.actionBy);
      this.sno.push(sna.actionon);
      this.report.push(this.sno);
    }
    let stateName:any='All';
    let distname:any='All';
    let hospitalname:any='All';
    let action:any='All';

    for (const element of this.stateList) {
      if (element.stateCode == this.stateCode) {
        stateName  = element.stateName;
      }
    }
    for (const element of this.districtList) {
      if (element.districtcode == this.districtCode) {
        distname = element.districtname;
      }
    }
    for (const element of this.hospitalList) {
      if (element.hospitalCode == this.hospitalId) {
        hospitalname = element.hospName;
      }
    }

    for(let element of this.actiondata){
      if(element.id==this.action){
        action=element.name;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['State Name', stateName]]);
      filter.push([['District Name', distname]]);
      filter.push([['Hospital Name', hospitalname]]);
      filter.push([['Empanelment Status', action]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital De-Empanel Report',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital De-Empanel Process", 60, 15);
      doc.setFontSize(13);
      doc.text('State Name :- ' + stateName, 15, 25);
      doc.text('District Name :- ' + distname, 15, 32);
      doc.text('Hospital Name :- ' + hospitalname, 15, 39);
      doc.text('Empanelment Status :-'+ action, 15, 46);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 53);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 60);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 65,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_De-Empanel_Report.pdf');
    }
  }

  downloaddetails(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
    this.report = [];
    let sna: any;
    for (let i = 0; i < this.logdetailslist.length; i++) {
      sna = this.logdetailslist[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.emastatus);
      this.sno.push(sna.remark);
      this.sno.push(sna.actionBy);
      this.sno.push(sna.actionon);
      this.report.push(this.sno);
    }

  if (no == 1) {
    let filter = [];
    filter.push([['Hospital Name', this.hospname]]);
    TableUtil.exportListToExcelWithFilter(
      this.report,
      'Hospital De-Empanel Log Details Report',
      this.heading1, filter
    );
  } else {
    if (this.report == null || this.report.length == 0) {
      this.swal("Info", "No Record Found", "info");
      return;
    }
    let doc = new jsPDF('p', 'mm', [297, 210]);
    doc.setFontSize(20);
    doc.text("Hospital De-Empanel Log Details", 60, 15);
    doc.setFontSize(13);
    doc.text('Hospital Name :- ' + this.hospname, 15, 25);
    doc.text('GeneratedOn :- ' + generatedOn, 15, 32);
    doc.text('GeneratedBy :- ' + generatedBy, 15, 39);
    autoTable(doc, {
      head: this.heading1,
      body: this.report,
      theme: 'grid',
      startY: 43,
      headStyles: {
        fillColor: [26, 99, 54]
      },
      columnStyles: {
        0: { cellWidth: 10 },
      }
    });
    doc.save('Hospital_De-Empanel_Log_Details_Report.pdf');
  }
  }


  downlordeempaneldoc(event:any,docpath:any){
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.qcadminServices.downlordeempaneldoc(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }


  showPreDoc1(text, index) {
    $('#proceduredescription' + index).text(text);
    $('#showMoreId6' + index).empty()
    $('#showMoreId7' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc1(text, index) {
    if (text.length > 30) {
      $('#proceduredescription' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId7' + index).empty()
      $('#showMoreId6' + index).empty();
      $('#showMoreId6' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  showPreDoc(text, index) {
    $('#proceduredescriptionlog' + index).text(text);
    $('#showMoreId8' + index).empty();
    $('#showMoreId9' + index).append('<div style="cursor: pointer; color: #1d89c9">Show Less</div>');
  }

  hidePreDoc(text, index) {
    if (text.length > 30) {
      // $('#showMoreId8' + index).empty();
      $('#proceduredescriptionlog' + index).text(text.substring(0, 30) + '...');
      $('#showMoreId9' + index).empty();
      $('#showMoreId8' + index).append('<span style="cursor: pointer; color: #1d89c9">Show More</span>');
    }
  }

  edit(item:any){
    let navigateExtras: NavigationExtras  = {
      state:item
    };
    this.route.navigate(['application/hospitaldeactivationprocess'], navigateExtras)
  }
}
