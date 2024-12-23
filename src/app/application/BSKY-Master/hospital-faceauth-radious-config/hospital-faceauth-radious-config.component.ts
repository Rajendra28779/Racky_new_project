import { Component, OnInit } from '@angular/core';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { HeaderService } from '../../header.service';
import { Router } from '@angular/router';
import { HospitalService } from '../../Services/hospital.service';
import Swal from 'sweetalert2';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { TableUtil } from '../../util/TableUtil';
import { DatePipe, formatDate } from '@angular/common';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-faceauth-radious-config',
  templateUrl: './hospital-faceauth-radious-config.component.html',
  styleUrls: ['./hospital-faceauth-radious-config.component.scss']
})
export class HospitalFaceauthRadiousConfigComponent implements OnInit {
  user: any;
  stateList: any=[];
  districtList: any=[];
  txtsearchDate:any;
  list:any=[];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  state:any="";
  dist:any="";
  totalcount:any=0;
  showsubmitbutton:any=false;

  constructor(private snoService: SnocreateserviceService,
    public headerService:HeaderService,private hospitaService: HospitalService,
    public route: Router,private sessionService: SessionStorageService
    ) { }

  ngOnInit(): void {
    this.headerService.setTitle("Hospital FaceAuth Radius Configuration");
    this.user = this.sessionService.decryptSessionData("user");
    this.getStateList();
    this.Search();
  }

  getStateList() {
  this.snoService.getStateList().subscribe(
    (response) => {
      this.stateList = response;
    },
    (error) => console.log(error)
  );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    )
  }

  Search(){
    this.showsubmitbutton=false;
    this.dataIdArray=[];
    this.state = $('#stateId').val();
    this.dist = $('#districtId').val();
    this.hospitaService.hospitallistforfaceradiousconfigure(this.state, this.dist,this.user.userId).subscribe((data:any)=>{
      this.list=data.data;  ;
      this.totalcount=this.list.length;
      if(this.totalcount>0){
        this.showPegi=true
        this.currentPage=1
        this.pageElement=100
      }else{
        this.showPegi=true
      }
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

  reset(){
    window.location.reload();
  }

  close() {
    $('#OtpModal').hide();
    $('#radious').val('');
  }

  validatedata(){
    if(this.dataIdArray.length==0){
      this.swal('Warning', 'Please select Hospital', 'warning');
      return;
    }
    $('#radious').val('');
    $('#OtpModal').show();
  }

  submitradious(){
    if(this.dataIdArray.length==0){
      this.swal('Warning', 'Please select Hospital', 'warning');
      return;
    }
    let radious = $('#radious').val();
    if(radious==null || radious=='' || radious ==undefined){
      this.swal('Warning', 'Please Enter FaceAuth Radius', 'warning');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: "You Want Update FaceAuth Radius !",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {

          let object ={
            hospotalIdlist:this.dataIdArray,
            faceauthradious:radious,
            createdBy:this.user.userId
          }
          this.hospitaService.savehospitalfaceradious(object).subscribe((data:any)=>{
            if(data.status == 200){
              this.swal('Success', data.message, 'success');
              this.close();
              this.Search();
              $('#radious').val('');
              this.dataIdArray = [];
            }else{
              this.swal('Error', "Something Went Wrong", 'error');
            }
          },
          (error) => console.log(error)
          );
      }
    });
  }

  dataIdArray:any=[];
  checkAllCheckBox(event: any) {
    // Angular 13
    if (event.target.checked) {
      // this.dataIdArray = [];
      for (let i = 0; i < this.list.length; i++) {
        $('#' + this.list[i].hospitalId).prop('checked', true);
        this.dataIdArray.push(this.list[i].hospitalId);
      }
    } else {
      for (let i = 0; i < this.list.length; i++) {
        $('#' + this.list[i].hospitalId).prop('checked', false);
        this.dataIdArray = [];
      }
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
    if (this.dataIdArray.length > 0) {
      this.showsubmitbutton = true;
    } else {
      this.showsubmitbutton = false;
    }
  }
  tdCheck(event: any, hospitalId) {
    if (event.target.checked) {
      this.dataIdArray.push(hospitalId);
    } else {
      for (let i = 0; i < this.dataIdArray.length; i++) {
        if (this.dataIdArray[i] == hospitalId) {
          this.dataIdArray.splice(i, 1);
        }
      }
    }
    if (this.dataIdArray.length == this.list.length) {
      $('#allCheck').prop('checked', true);
    } else {
      $('#allCheck').prop('checked', false);
    }
    if (this.dataIdArray.length > 0) {
      this.showsubmitbutton = true;
    } else {
      this.showsubmitbutton = false;
    }
    this.dataIdArray = this.dataIdArray.filter(
      (value, index) => this.dataIdArray.indexOf(value) === index
    );
  }

  heading=[['Sl#', 'Hospital Name', 'Hospital Code', 'Hospital MobileNo', 'Hospital emailId', 'Current FaceAuth Radius']];
  report:any=[];
  downloadList(no: any) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy = this.user.fullName;
    this.report = [];
    let row: any;
    for (let i = 0; i < this.list.length; i++) {
      let v = this.list[i];
      row = [];
      row.push(i + 1); // Sl#
      row.push(v.hospitalName); // Hospital Name
      row.push(v.hospitalCode); // Hospital Code
      row.push(v.mobileNo); // Hospital MobileNo
      row.push(v.emailId); // Hospital emailId
      row.push(v.faceauthradious); // FaceAuth Radious
      this.report.push(row);
    }

    let statename:any="All";
    let distname:any="All";

    for (let j = 0; j < this.stateList.length; j++) {
      if (this.stateList[j].stateCode == this.state) {
        statename  = this.stateList[j].stateName;
      }
    }
    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.dist) {
        distname = this.districtList[j].districtname;
      }
    }

    if (no == 1) {
      let filter = [];
      filter.push([['State Name', statename]]);
      filter.push([['District Name', distname]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Hospital FaceAuth Radius Report',
        this.heading,
        filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      let doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Hospital FaceAuth Radius Report", 60, 15);
      doc.setFontSize(13);
      doc.text('State Name:- ' + statename, 15, 25);
      doc.text('District Name :- ' + distname, 15, 32);
      doc.text('Generated On :- ' + generatedOn, 15, 39);
      doc.text('Generated By :- ' + generatedBy, 15, 46);

      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('Hospital_FaceAuth_Radius_Report.pdf');
    }
  }

  isAscending: boolean = true;
  changeOrderBy(type: string) {
    const orderIconMap = {
      RADIUS: '#orderByRadius',
    };

    const sortingFunctionMap = {
      RADIUS: (a, b) => parseInt(a.faceauthradious) - parseInt(b.faceauthradious)
    };
    const toggleIconClass = (iconSelector: string) => {
      $(iconSelector).toggleClass('bi bi-arrow-up-circle-fill bi bi-arrow-down-circle-fill');
    };

    const sortBy = sortingFunctionMap[type];
    const iconSelector = orderIconMap[type];

    this.list.sort((a, b) => {
      if (this.isAscending) {
        return sortBy(a, b);
      } else {
        return sortBy(b, a);
      }
    });

    toggleIconClass(iconSelector);
    this.isAscending = !this.isAscending;
  }

}
