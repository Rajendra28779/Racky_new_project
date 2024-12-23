import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { UsercreateService } from '../../Services/usercreate.service';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-moboilenoupdatelog',
  templateUrl: './moboilenoupdatelog.component.html',
  styleUrls: ['./moboilenoupdatelog.component.scss']
})
export class MoboilenoupdatelogComponent implements OnInit {
  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean=false;
  userData: any = [];
  txtsearchDate: any;
  user:any;

  constructor(private userservice: UsercreateService,public headerService: HeaderService,
    private encryptionService: EncryptionService, private sessionService: SessionStorageService) { }

  ngOnInit(): void {
    this.headerService.setTitle("Update Mobbile No");
    this.user =this.sessionService.decryptSessionData("user");
    this.getUserDetails();
  }

  getUserDetails() {
    this.userData = [];
    this.userservice.getmobilenoupdateloglist(this.user.userId).subscribe((data:any) => {
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

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  report: any = [];
  sno: any = [];
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email Id', 'State', 'District',
   'Group', 'Requested Through','Description','Updated By','Updated On']];
  downloadReport(type) {
    let generatedOn = formatDate(new Date(), 'dd-MMM-yyyy hh:mm:ss a', 'en-US').toString();
    let generatedBy =  this.user.fullName;
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
      this.sno.push(sna.rqstthrough);
      this.sno.push(sna.description);
      this.sno.push(sna.updatedby);
      this.sno.push(sna.updatedon);
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
      var doc = new jsPDF('l', 'mm', [297, 210]);
      doc.setFontSize(20);
      doc.text("Mobileno Updated Log List", 120, 15);
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
      doc.save('Mobileno Updated Log List.pdf');
    }
    }

    showPreDoc1(text,no:any) {
      $('#preAuthDocId'+no).text(text);
      $('#showMoreId'+no).empty();
      $('#showMoreId'+no+1).append(
        '<div style="cursor: pointer; color: #1d89c9">Show Less</div>'
      );
    }

    hidePreDoc1(text,no:any) {
      if (text.length > 30) {
        $('#preAuthDocId'+no).text(text.substring(0, 30) + '...');
        $('#showMoreId'+no+1).empty();
        $('#showMoreId'+no).empty();
        $('#showMoreId'+no).append(
          '<span style="cursor: pointer; color: #1d89c9">Show More</span>'
        );
      }
    }

}
