import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import Swal from 'sweetalert2';
import { formatDate } from '@angular/common';
import { TableUtil } from '../../util/TableUtil';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-speciality-qc-approval-view',
  templateUrl: './hospital-speciality-qc-approval-view.component.html',
  styleUrls: ['./hospital-speciality-qc-approval-view.component.scss']
})
export class HospitalSpecialityQcApprovalViewComponent implements OnInit {

  user: any;
  stateList: any = [];
  districtList: any = [];
  hospitalList: any = [];
  list: any = [];
  record: any = 0;
  txtsearchDate: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  statecode: any;
  districtcode: any;
  keyword: any = 'hospitalName';
  hospName:any="ALL";
  hospitalCode:any="";
  type:any;
  statename:any="All";
  distname:any="All";

  constructor(private snoService: SnocreateserviceService,
    public headerService: HeaderService,
    public qcadminserv: QcadminServicesService,private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle('Approval Status');
    this.user =this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.search();
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
    this.hospitalList = [];
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

  clearEvent() {
    this.hospitalCode = '';
    this.hospName = "ALL";
  }

  selectEvent(item) {
    this.hospitalCode = item.hospitalCode;
    this.hospName = item.hospitalName;
  }

  search(){
    this.statecode=$('#stateId').val();
    this.districtcode=$('#districtId').val();
    this.type=$('#type').val();
    this.qcadminserv.specialityapprovelist(this.statecode, this.districtcode,this.hospitalCode,this.type,this.user.userId).subscribe((data:any)=>{
      if(data.status==200){
            this.list=data.data;
            this.record=this.list.length;
            if(this.record>0){
              this.showPegi=true
              this.currentPage=1
              this.pageElement=100
            }else{
              this.showPegi=true
            }
      }else{
        this.swal("error","Some Thing Went Wrong","Error")
      }
    },
    (error) => this.swal("error","Some Thing Went Wrong","Error")
    );
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
    sno: any = {
      Slno: "",
      state: "",
      dist: "",
      hospital: "",
      package: "",
      actionby: "",
      actionon: "",
      actiontype: "",
    };
    heading = [['Sl No.',
    'State Name',
    'District Name',
    'Hospital Name',
    'Package Name',
    'Action By',
    'Action On',
    'Action Type',]];

  downloadReport(no:any){
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna=this.list[i];
      this.sno=[];
      this.sno.Slno=i+1;
      this.sno.state=sna.stateName;
      this.sno.dist=sna.distName;
      this.sno.hospital=sna.hospitalname;
      this.sno.package=sna.packagename;
      this.sno.actionby=sna.actionby;
      this.sno.actionon=sna.actionon;
      this.sno.actiontype=sna.actiontype;
      this.report.push(this.sno);
    }
    for(let j=0; j < this.stateList.length;j++){
      if(this.stateList[j].stateCode==this.statecode){
        this.statename=this.stateList[j].stateName;
      }
    }
    for(let j=0; j < this.districtList.length;j++){
      if(this.districtList[j].districtcode==this.districtcode){
        this.distname=this.districtList[j].districtname;
      }
    }
    let actiontype;
    if(this.type==2){
      actiontype="Approved";
    }else if(this.type==2){
      actiontype="Rejected";
    }else {
      actiontype="All";
    }
    if(no==1){
      let filter =[];
      filter.push([['State Name', this.statename]]);
      filter.push([['District Name', this.distname]]);
      filter.push([['Hospital Name', this.hospName]]);
      filter.push([['Action type', actiontype]]);
        TableUtil.exportListToExcelWithFilter(
          this.report,
          'Hospital Specialitty Approve Status Report',
          this.heading,filter
        );
    }else{
      if(this.report==null || this.report.length==0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm',[297,210 ]);
      doc.setFontSize(20);
      doc.text("Hospital Specialitty Approve Status Report", 85, 15);
      doc.setFontSize(13);
      doc.text('State Name :- '+ this.statename,15,23);
      doc.text('District Name :- '+ this.distname,190,23);
      doc.text('Hospital Name :- '+ this.hospName,15,31);
      doc.text('Action Type :- '+ actiontype,190,31);
      doc.text('GeneratedOn :- '+generatedOn,190,39);
      doc.text('GeneratedBy :- '+generatedBy,15,39);
            var rows = [];
            for(var i=0;i<this.report.length;i++) {
              var clm = this.report[i];
              var pdf = [];
              pdf[0] = clm.Slno;
              pdf[1] = clm.state;
              pdf[2] = clm.dist;
              pdf[3] = clm.hospital;
              pdf[4] = clm.package;
              pdf[5] = clm.actionby;
              pdf[6] = clm.actionon;
              pdf[7] = clm.actiontype;
              rows.push(pdf);
            }
            autoTable(doc, {
              head: this.heading,
              body: rows,
              theme: 'grid',
              startY: 45,
              headStyles: {
                fillColor: [26, 99, 54]
              },
              columnStyles: {
                0: {cellWidth: 10},
              }
            });
            doc.save('Hospital Specialitty Approve Status Report.pdf');
    }
  }

  onReset(){
    window.location.reload();
  }

}
