import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from '../../util/TableUtil';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import autoTable from 'jspdf-autotable';
import { DatePipe, formatDate } from '@angular/common';
import jsPDF from 'jspdf';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-mobilenouupdate',
  templateUrl: './mobilenouupdate.component.html',
  styleUrls: ['./mobilenouupdate.component.scss']
})
export class MobilenouupdateComponent implements OnInit {

  constructor(private userservice: UsercreateService,public headerService: HeaderService,
    private encryptionService: EncryptionService, private sessionService: SessionStorageService) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean=false;
  userData: any = [];
  groupList: any = [];
  groupId: any;
  txtsearchDate: any;
  grp:any="";
  maxChars:any=500;
  groupTypeName: any = "ALL";
  user1:any
  updatinglist:any;
  mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  mobileformat = /[6-9][0-9]{9}$/;
  showedit:any = false

  ngOnInit(): void {
    this.headerService.setTitle("Update Mobbile No");
    this.user1 =this.sessionService.decryptSessionData("user");
    this.getGroupList();
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.userData=[];
    $('#groupId').val("");
  }

  edit(item: any) {
    this.updatinglist=item;
    this.showedit=true;
  }
  getResponseFromUtil(){
    this.showedit=false;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  validatePhoneNo() {
    let mobileNo = $('#mobile').val().toString();
    if (!mobileNo.match(this.mobileformat)) {
      $("#mobile").focus();
      this.swal("Info", "Please Enter 10 digit Mobile No", 'info');
      return;
    }
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /^[A-Za-z0-9.,-_ \\s]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validateEmail() {
    let emailId = $('#email').val().toString();
    if (!emailId.match(this.mailformat)) {
      $("#email").focus();
      this.swal("Info", "Please Provide Valid Email Id", 'info');
      return;
    }
  }

  getGroupList() {
    this.userservice.getGroupList().subscribe(
      (response: any) => {
        response = this.encryptionService.getDecryptedData(response);
        this.groupList = response.data;
      },
      (error) => console.log(error)
    )
  }

  getUserDetails() {
    this.groupId = $('#groupId').val();
    if(this.groupId==null ||this.groupId==undefined||this.groupId==""){
      this.swal("Info", "Please Select Group !", "info");
      return;
    }
    this.userData = [];
    this.userservice.getuserlistformobilenoupdate(this.grp, this.user1.userId).subscribe((data:any) => {
        if(data.status==200){
          this.userData=data.data;
          if(this.userData.length>0){
            this.currentPage = 1;
            this.pageElement = 100;
            this.showPegi=true;
          }
        }else{
          this.swal("Error", "Something Went Wrong !", "error");
        }
      }
    );
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email Id', 'State', 'District', 'Group', 'Status']];
  downloadReport(type) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user1.fullName;
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.userData.length; i++) {
      sna = this.userData[i];
      this.sno = [];
      this.sno.push(i + 1);
      this.sno.push(sna.fullName);
      this.sno.push(sna.userName);
      this.sno.push(sna.mobileNo);
      this.sno.push(sna.emailId);
      this.sno.push(sna.stateName);
      this.sno.push(sna.districtname);
      this.sno.push(sna.groupTypeName);
      this.report.push(this.sno);
    }
    if (type == 1) {
      let filter = [];
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'User List',
        this.heading, filter
      );
    } else {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('p', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("User List", 80, 15);
      doc.setFontSize(13);
      doc.text('GeneratedOn :- ' + generatedOn, 15, 25);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      autoTable(doc, {
        head: this.heading,
        body: this.report,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 10 },
        }
      });
      doc.save('User_List.pdf');
    }
    }

    updatemobileno(){
      let userid=this.updatinglist.userId;
      let mobile=this.updatinglist.mobileNo;
      let email=this.updatinglist.emailId;
      let rqst=$('#request').val();
      let description=$('#description').val().toString().trim();
      if(mobile==null ||mobile==undefined||mobile==""){
        this.swal("Info", "Please Enter Valid Mobile No !", "info");
        return;
      }

      if(email==null ||email==undefined||email==""){
        this.swal("Info", "Please Enter Valid Email Id !", "info");
        return;
      }

      if(rqst==null ||rqst==undefined||rqst==""){
        this.swal("Info", "Please Select Request Through !", "info");
        return;
      }

      if(description==null ||description==undefined||description==""){
        this.swal("Info", "Please Enter Description !", "info");
        return;
      }
      Swal.fire({
        title: 'Are you sure?',
        text: "You want to Update this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Update it!'
      }).then((result) => {
        if (result.isConfirmed) {
            this.userservice.updatemobileno(userid,mobile,email,rqst,description,this.user1.userId).subscribe((data:any)=>{
                if(data.status == 200){
                  this.swal("Success", "Record Updated Successfully", "success");
                  $('#request').val('');
                  $('#description').val('');
                  this.getResponseFromUtil();
                }else{
                  this.swal("Error", "Something Went Wrong !", "error");
                }
            });
          }
      });
    }
}
