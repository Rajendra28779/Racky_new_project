import { Component, OnInit } from '@angular/core';
import { UsercreateService } from '../../Services/usercreate.service';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { InternalGrivanceServiceService } from '../../Services/internal-grivance-service.service';
import { TableUtil } from '../../util/TableUtil';
import jsPDF from 'jspdf';
import { DatePipe } from '@angular/common';
import autoTable from 'jspdf-autotable';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-swasthya-mitra-geo-tagging',
  templateUrl: './swasthya-mitra-geo-tagging.component.html',
  styleUrls: ['./swasthya-mitra-geo-tagging.component.scss']
})
export class SwasthyaMitraGeoTaggingComponent implements OnInit {

  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Is Geo Tagged']];
  checkAllBox: boolean = false;
  backUpUserData: any = [];
  selectedUser: any = [];
  otpLogList: any = [];
  groupList: any = [];
  txtsearchDate: any;
  userData: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  report: any = [];
  groupName: any;
  // Filtered: any;
  fullName: any;
  record: any;
  user: any;

  constructor(
    private internalGrivanceServiceService: InternalGrivanceServiceService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService,
    private userservice: UsercreateService,
    private headerService: HeaderService,
    private snopipePipe: SnopipePipe
  ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Swasthya Mitra Geo Tagging Attendance');
    this.user = this.sessionService.decryptSessionData("user");
    this.currentPage = 1;
    this.pageElement = 50;
    // this.getUserDetails();
    this.getGeoTagingDetails(3, 0, '');
  }

  geoTaggingDetails: any = [];
  geoLogDetails: any = [];

  getGeoTagingDetails(actioncode, userId, fullname) {
    this.fullName = fullname;
    let request = {
      actionCode: actioncode,
      userId: userId
    };
    this.currentPage = 1;
    this.pageElement = 50;
    this.userservice.updateGeoTagging(request).subscribe(
      (response: any) => {
        if (response.status == "success") {
          if (actioncode == 3) {
            this.selectedUser = [];
            this.geoTaggingDetails = [];
            this.geoTaggingDetails = response.data;
            this.backUpUserData = this.geoTaggingDetails;
            let count = 0;
            this.geoTaggingDetails.forEach((element) => {
              if (element.geoTag == 0) {
                count++;
                let info = {
                  userId: element.userId,
                  status: 0,//0-tagged in db, 1-untagged in db, 2-newly inserted
                  geoTag: 0,//0-tagged, 1-untagged
                }
                this.selectedUser.push(info);
              } else if (element.geoTag == 1) {
                let info = {
                  userId: element.userId,
                  status: 1,//0-tagged in db, 1-untagged in db, 2-newly inserted
                  geoTag: 1,//0-tagged, 1-untagged
                }
                this.selectedUser.push(info);
              }
            });
            if (count == this.backUpUserData.length) {
              this.checkAllBox = true;
            } else {
              this.checkAllBox = false;
            }
            this.record = this.backUpUserData.length;
            if (this.record > 0) {
              this.showPegi = true;
            } else {
              this.showPegi = false;
            }
          } else {
            this.geoLogDetails = response.data;
          }
        } else {
          this.swal('Error', 'Failed to get the data!', 'error');
          console.log(response.message);
        }
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong', 'error');
      }
    );
  }

  // getUserDetails() {
  //   this.userData = [];
  //   this.currentPage = 1;
  //   this.pageElement = 50;
  //   this.internalGrivanceServiceService
  //     .getGrievanceByDetails(14)
  //     .subscribe((data) => {
  //       // this.Filtered = data;
  //       // if (this.Filtered.length != 0) {
  //       //   this.userData = this.snopipePipe.transform(
  //       //     this.userData,
  //       //     this.Filtered
  //       //   );
  //       // } else if (this.Filtered.length <= 0) {
  //       //   Swal.fire('', 'No Record Found !', 'info');
  //       // }
  //       this.backUpUserData = this.userData;
  //       let count = 0;
  //       this.userData.forEach((element) => {
  //         if (element.isOtp == 0) {
  //           count = count + 1;
  //         }
  //       });
  //       if (count == this.userData.length) {
  //         this.checkAllBox = true;
  //       } else {
  //         this.checkAllBox = false;
  //       }
  //       this.record = this.userData.length;
  //       if (this.record > 0) {
  //         this.showPegi = true;
  //       } else {
  //         this.showPegi = false;
  //       }
  //     });
  // }

  selectAllCheckBoxes(checked) {//geoTaggingDetails

    if (checked) {
      this.checkAllBox = true;
      for (const element of this.selectedUser) {
        element.geoTag = 0;
      }
      this.geoTaggingDetails.forEach(element => {
        let flag = true;
        for (let i = 0; i < this.selectedUser.length; i++) {
          if (element.userId == this.selectedUser[i].userId) {
            flag = false;
            break;
          }
        }
        if (flag) {
          let info = {
            userId: element.userId,
            status: 2,//0-tagged in db, 1-untagged in db, 2-newly inserted
            geoTag: 0,//0-tagged, 1-untagged
          }
          this.selectedUser.push(info);
        }
      });

      for (const element of this.selectedUser)
        $('#' + element.userId).prop('checked', true);

    } else {
      this.checkAllBox = false;
      let tempStore: any = [];
      for (const element of this.selectedUser)
        $('#' + element.userId).prop('checked', false);

      for (const element of this.selectedUser) {
        if (element.status != 2) {
          element.geoTag = 1;
          tempStore.push(element);
        }
      }
      this.selectedUser = tempStore;
    }
    console.log(this.selectedUser);

  }

  selectSingleCheckBox(checked, data) {
    let info = {
      userId: data.userId,
      status: 2,//0-tagged in db, 1-untagged in db, 2-newly inserted
      geoTag: 0,//0-tagged, 1-untagged
    }
    let flag = true;
    if (checked) {
      for (const element of this.selectedUser) {
        if (element.userId == data.userId) {
          element.geoTag = 0;
          flag = false;
          break;
        }
      }
      if (flag) {
        this.selectedUser.push(info);
      }
    } else {
      for (const element of this.selectedUser) {
        if (element.userId == data.userId && element.status != 2) {
          element.geoTag = 1;
          flag = false;
          break;
        }
      }
      if (flag) {
        for (const element of this.selectedUser) {
          if (element.userId == data.userId) {
            let index = this.selectedUser.indexOf(element);
            if (index !== -1) {
              this.selectedUser.splice(index, 1);
            }
          }
        }
      }
    }

    console.log(this.selectedUser);

    let count = 0;
    for (const element of this.selectedUser)
      if (element.geoTag == 0) count++;

    if (count == this.geoTaggingDetails.length) this.checkAllBox = true;
    else this.checkAllBox = false;
  }

  submit() {
    if (this.selectedUser.length == 0) {
      this.swal('Info', 'Please select at least one User', 'info');
      return;
    }

    Swal.fire({
      title: 'Are You Sure?',
      text: 'You Want To Update These Data!',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          actionCode: 1,
          createdBy: this.user.userId,
          attendance: this.selectedUser
        }
        this.userservice.updateGeoTagging(data).subscribe(
          (data: any) => {
            if (data.status == "success") {
              this.swal('Success', 'Geo Tagging Updated Succefully', 'success');
              this.selectedUser = [];
              this.getGeoTagingDetails(3, 0, '');
            } else if (data.status == "blank") {
              this.swal('Info', data.message, 'info');
            } else {
              this.swal('Error', 'Something went wrong', 'error');
              console.log(data.message);
            }
          },
          (error) => {
            console.log(error);
            this.swal('Error', 'Something went wrong', 'error');
          }
        );
      }
    });
  }

  onReset() {
    this.getGeoTagingDetails(3, 0, '');
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  downloadReport(type) {
    this.report = [];
    let item: any;
    for (var i = 0; i < this.backUpUserData.length; i++) {
      item = this.geoTaggingDetails[i];
      this.user = [];
      this.user.slNo = i + 1;
      this.user.fullname = item.fullname;
      this.user.username = item.username;
      this.user.phoneno = item.mobileNo;
      this.user.status = (item.geoTag == 0 ? 'Tagged' : 'Untagged');

      if (item.isOtp == 0) {
        this.user.status = "Yes";
      } else if (item.isOtp == 1) {
        this.user.status = "No";
      }
      this.report.push(this.user);
    }
    if (type == 1) {
      let filter = [];
      // TableUtil.exportListToExcel(this.report, "User Details List", this.heading);
      TableUtil.exportListToExcelWithFilter(this.report, "Swasthya Mitra Geo Tagging Attendance list", this.heading, filter);
    } else if (type == 2) {
      if (this.report == null || this.report.length == 0) {
        this.swal("Info", "No Record Found", "info");
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 260]);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Swasthya Mitra Geo Tagging Attendance list", 125, 10);
      doc.setFontSize(12);
      doc.text("Generated On: " + this.convertDate(new Date()), 190, 33);
      doc.text("Generated By: " + this.sessionService.decryptSessionData("user").fullName, 40, 39);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.slNo;
        pdf[1] = clm.fullname;
        pdf[2] = clm.username;
        pdf[3] = clm.phoneno;
        // pdf[4] = clm.groupName;
        pdf[4] = clm.status;
        rows.push(pdf);
      }

      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 50,
        headStyles: {
          fillColor: [26, 99, 54]
        },
        columnStyles: {
          0: { cellWidth: 20 },
          1: { cellWidth: 80 },
          2: { cellWidth: 50 },
          3: { cellWidth: 40 },
          4: { cellWidth: 50 },
          5: { cellWidth: 40 }
        }
      });
      doc.save('Swasthya Mitra Geo Tagging Attendance list.pdf');
    }
  }

  convertDate(date) {
    var datePipe = new DatePipe("en-US");
    date = datePipe.transform(date, 'dd-MMM-yyyy hh:mm:ss a');
    return date;
  }
}
