import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UsercreateService } from '../../Services/usercreate.service';
import { Router, NavigationExtras } from '@angular/router';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TableUtil } from '../../util/TableUtil';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EncryptionService } from 'src/app/services/encryption.service';

@Component({
  selector: 'app-tsu-user-master',
  templateUrl: './tsu-user-master.component.html',
  styleUrls: ['./tsu-user-master.component.scss']
})
export class TsuUserMasterComponent implements OnInit {

  constructor(private userservice: UsercreateService, private route: Router, public headerService: HeaderService,
    private snopipePipe: SnopipePipe, private encryptionService: EncryptionService) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  userData: any = [];
  groupList: any = [];
  stateList: any;
  districtList: any;
  Filtered: any;
  groupId: any;
  stateId: any;
  districtId: any;
  txtsearchDate:any;
  
  ngOnInit(): void {
    this.headerService.setTitle("User Details Report");
    this.currentPage = 1;
    this.pageElement = 100;    
    $('#groupId').val("");
    $('#stateId').val("");
    $('#districtId').val("");
    this.getUserDetails();
    this.getGroupList();
    this.getStateList();
  }

  // getUserDetails() {
  //   this.userservice.getUserDetails().subscribe((alldta) => {
  //     console.log("print the data:")
  //     console.log(alldta);
  //     this.userData = alldta;
  //     this.record = this.userData.length;
  //     if (this.record > 0) {
  //       this.showPegi = true;
  //     }
  //     else {
  //       this.showPegi = false;
  //     }
  //   })
  // }

  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  
  resetTable() {
    this.currentPage = 1;
    this.pageElement = 100;
    this.districtList = [];
    $('#groupId').val("");
    $('#stateId').val("");
    $('#districtId').val("");
    this.getUserDetails();  
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        bskyUserId: item
      }
    };
    this.route.navigate(['/application/createuser'], objToSend);
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  
  getGroupList() {
    let groups;
    this.userservice.getGroupList().subscribe(
      (response : any) => {
        response = this.encryptionService.getDecryptedData(response);
        groups = response.data;
        console.log(groups);
        for(var i=0;i<groups.length;i++) {
          var g = groups[i];
          if(g.typeId!=3&&g.typeId!=5) {
            this.groupList.push(g);
          }
        }
        console.log(this.groupList);
      },
      (error) => console.log(error)
    )
  }

  getStateList() {
    this.userservice.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }

  OnChangeState(id) {
    $('#districtId').val("");
    localStorage.setItem("stateCode", id);
    console.log("State Id" + id);
    this.userservice.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log("State List:")
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  getUserDetails() {
    console.log('groupId: '+$('#groupId').val());
    console.log('stateId: '+$('#stateId').val());

    this.groupId = $('#groupId').val();
    this.stateId = $('#stateId').val();
    this.districtId = $('#districtId').val();
  
    this.userData = [];
    this.currentPage = 1;
    this.pageElement = 100;

    this.userservice.getUserDetailsData(this.groupId, this.stateId, this.districtId).subscribe(
      (data) => {
        this.Filtered = data;
        console.log(data)
        if (this.Filtered.length != 0) {
          this.userData = this.snopipePipe.transform(this.userData, this.Filtered);
          $('#htmlData').show();
        }
        else if (this.Filtered.length <= 0) {
          $('#htmlData').hide();
          Swal.fire("", "No Record Found !", 'info');
        }
        this.record = this.userData.length;
        if (this.record > 0) {
          this.showPegi = true;
        }
        else {
          this.showPegi = false;
        }
      }
    );
  }

  report: any = [];
  user: any = {
    slNo: "",
    fullname: "",
    userName: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    group: "",
    status: "",
  };  
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email Id', 'State', 'District', 'Group', 'Status']];

  downloadReport(type: any) {
    if(this.userData == "" || this.userData == undefined || this.userData.length==0)
      {
        this.swal('Info','No Data Found', 'info');
        return;
      }
    //console.log(this.userData);
    this.report = [];
    if(type == 'excel'){
    let item: any;
    for(var i=0;i<this.userData.length;i++) {
      item = this.userData[i];
      console.log(item);
      this.user = [];
      this.user.slNo = i+1;
      this.user.fullname = item.fullName;
      this.user.userName = item.userName;
      this.user.mobile = item.mobileNo.toString();
      this.user.email = item.emailId;
      this.user.state = item.districtCode.statecode.stateName;
      this.user.district = item.districtCode.districtname;
      this.user.group = item.groupId.groupTypeName;
      if(item.status == '0') {
        this.user.status = "Active";
      } else if(item.status == '1') {
        this.user.status = "Inactive";
      }
      this.report.push(this.user);
      console.log(this.report);
      console.log(this.user);
    }
    TableUtil.exportListToExcel(this.report, "User Details Report", this.heading);
    }else if(type == 'pdf'){
      if(this.userData == "" || this.userData == undefined || this.userData.length==0)
      {
        this.swal('Info','No Data Found', 'info');
        return;
      }
      const doc = new jsPDF('p', 'mm', [240, 272]);
      doc.setFontSize(12);
      doc.text('User Details',5,10);
      doc.setLineWidth(0.7);
      doc.line(5,11,29,11);
      let pdfRpt = [];
      for(var x=0;x<this.userData.length;x++) {
        var flt = this.userData[x];
        var pdf = [];
        pdf[0] = x+1;
        pdf[1] = flt.fullName!=null?flt.fullName:'-NA-';
        pdf[2] = flt.userName!=null?flt.userName:'-NA-';
        pdf[3] = flt.mobileNo!=null?flt.mobileNo.toString():'-NA-';
        pdf[4] = flt.emailId!=null?flt.emailId:'-NA-';
        pdf[5] = flt.districtCode.statecode.stateName!=null?flt.districtCode.statecode.stateName:'-NA-';
        pdf[6] = flt.districtCode.districtname!=null?flt.districtCode.districtname:'-NA-';
        pdf[7] = flt.groupId.groupTypeName!=null?flt.groupId.groupTypeName:'-NA-';
        if(flt.status=='0'){
          pdf[8] = "Active";
        }else if(flt.status == '1'){
          pdf[8] = "InActive";
        }
        pdfRpt.push(pdf);
      }
      console.log(pdfRpt);
      autoTable(doc, {
        head: this.heading,
        body: pdfRpt,
        startY:28,
        theme: 'grid',
        headStyles: {
          fillColor: [26, 99, 54]
        },
      
        columnStyles: {
          0: {cellWidth: 20},
          1: {cellWidth: 27},
          2: {cellWidth: 24},
          3: {cellWidth: 24},
          4: {cellWidth: 36},
          5: {cellWidth: 20},
          6: {cellWidth: 20},
          7: {cellWidth: 20},
          8: {cellWidth: 20},
        }          
      }); 
      doc.save('User Details Report_'+'.pdf');  
      }
  }

  onPageBoundsCorrection(number: number) {
    this.currentPage = number;
}
}
