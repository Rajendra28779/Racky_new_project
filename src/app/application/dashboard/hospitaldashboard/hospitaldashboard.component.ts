import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { HospitalService } from '../../Services/hospital.service';
import { NotificationService } from '../../Services/notification.service';
import { ReportcountService } from '../../Services/reportcount.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
// import * as $ from 'jquery';
declare let $: any;

@Component({
  selector: 'app-hospitaldashboard',
  templateUrl: './hospitaldashboard.component.html',
  styleUrls: ['./hospitaldashboard.component.scss']
})
export class HospitaldashboardComponent implements OnInit {
  user: any;
  message: any;
  months: any = [];
  monthList: any = [];
  yearList: any = [];
  month: any;
  year: any;
  mobileformat = /[6-9][0-9]{9}$/;
  userName: string;
  list: any = [];
  listcount: any;
  getbyhId: any;
  colors: string[] = ['blue', 'red'];
  currentIndex: number = 0;
  claimCount: any;
  date: any;

  @ViewChild('hiddenbutton') hiddenbutton;
  @ViewChild('closebutton') closebutton;
  constructor(public headerService: HeaderService, private hospitaService: HospitalService, private reportCount: ReportcountService,
    public router: Router, private notificationservice: NotificationService, private userService: SnocreateserviceService, private sessionService: SessionStorageService) { }

  position = {
    latitude: '',
    longitude: '',
  }

  ngOnInit(): void {

    this.headerService.setTitle('Dashboard');
    this.user = this.sessionService.decryptSessionData("user");
    let Mobile = this.user.phone;
    this.date = new Date();
    let monthId = this.date.getMonth() + 1;
    let checkMonth = monthId.toString();
    if (checkMonth.length == 1) {
      this.month = '0' + monthId;
    } else {
      this.month = monthId;
    }
    this.year = this.date.getFullYear();
    this.notification();
    $('#modalNotify').hide();
    // if(this.user.groupId==5) {
    let latitude;
    let longitude;
    this.hospitaService.getbyUserId(this.user.userId).subscribe(
      (result: any) => {
        this.getbyhId = result;
        console.log(this.getbyhId);
        latitude = this.getbyhId.hospital.latitude;
        longitude = this.getbyhId.hospital.longitude;
        if (latitude == null || longitude == null) {
          this.hiddenbutton.nativeElement.click();
          setInterval((timeout) => {
            $('#tag').css({
              color: this.colors[this.currentIndex]
            });
            if (!this.colors[this.currentIndex]) {
              this.currentIndex = 0;
            } else {
              this.currentIndex++;
            }
          }, 200);
          $('#latitude').val(latitude);
          $('#longitude').val(longitude);
          $('#exampleModal1').on('hidden.bs.modal', (result) => {
            this.logout();
          });
          // } else {
          //   this.hospitaService.getPosition().then(pos=> {
          //     console.log(pos);
          //     let lt = pos.lat.toString().trim();
          //     this.position.latitude = lt.length>6?lt.substring(0, 6):lt;
          //     let lg = pos.lng.toString().trim();
          //     this.position.longitude = lg.length>6?lg.substring(0, 6):lg;
          //     if(latitude) {
          //       latitude = latitude.toString().trim()
          //       latitude = latitude.length>6?latitude.substring(0, 6):latitude
          //     }
          //     if(longitude) {
          //       longitude = longitude.toString().trim()
          //       longitude = longitude.length>6?longitude.substring(0, 6):longitude
          //     }
          //     if(latitude != this.position.latitude || longitude != this.position.longitude) {
          //       console.log(latitude+' : '+longitude);
          //       console.log(this.position.latitude+' : '+this.position.longitude);
          //       this.swal('Warning', 'Hospital Login from Wrong Location', 'warning');
          //       this.logout();
          //     }
          //   },err=> {
          //     console.log('Error: ');
          //     console.log(err);
          //     if(err) {
          //       this.swal('Warning', 'Please allow location access', 'warning');
          //       this.logout();
          //     }
          //   });
        } else {
          if (Mobile == null || Mobile == "" || Mobile == undefined || !(Mobile.toString()).match(this.mobileformat)) {
            Swal.fire({
              title: 'Kindly Add/Correct Your Mobile Number',
              text: "",
              icon: 'warning',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                this.profile();
              }
            });
          }
        }
      }
    );
    // this.months = [
    //   { monthId: '01', monthName: 'JANUARY', index: 0 },
    //   { monthId: '02', monthName: 'FEBRUARY', index: 1 },
    //   { monthId: '03', monthName: 'MARCH', index: 2 },
    //   { monthId: '04', monthName: 'APRIL', index: 3 },
    //   { monthId: '05', monthName: 'MAY', index: 4 },
    //   { monthId: '06', monthName: 'JUNE', index: 5 },
    //   { monthId: '07', monthName: 'JULY', index: 6 },
    //   { monthId: '08', monthName: 'AUGUST', index: 7 },
    //   { monthId: '09', monthName: 'SEPTEMBER', index: 8 },
    //   { monthId: '10', monthName: 'OCTOBER', index: 9 },
    //   { monthId: '11', monthName: 'NOVEMBER', index: 10 },
    //   { monthId: '12', monthName: 'DECEMBER', index: 11 },
    // ];
    this.getMonth();
    this.getCountDetails();
  }

  getGeoLocation() {
    this.hospitaService.getPosition().then(pos => {
      console.log(pos);
      let latitude = pos.lat.toString().trim();
      this.position.latitude = latitude.length > 6 ? latitude.substring(0, 6) : latitude;
      let longitude = pos.lng.toString().trim();
      this.position.longitude = longitude.length > 6 ? longitude.substring(0, 6) : longitude;
    }, err => {
      console.log('Error: ');
      console.log(err);
      if (err) {
        this.swal('Warning', 'Please allow location access', 'warning');
      }
    });
  }

  geoTag() {
    this.hospitaService.getPosition().then(pos => {
      console.log(pos);
      let latitude = pos.lat.toString().trim();
      this.position.latitude = latitude.length > 6 ? latitude.substring(0, 6) : latitude;
      let longitude = pos.lng.toString().trim();
      this.position.longitude = longitude.length > 6 ? longitude.substring(0, 6) : longitude;
      $('#latitude').val(this.position.latitude);
      $('#longitude').val(this.position.longitude);
    }, err => {
      console.log('Error: ');
      console.log(err);
      if (err) {
        this.swal('Warning', 'Please allow location access', 'warning');
      }
    });
  }

  update() {
    let latitude = $('#latitude').val();
    let longitude = $('#longitude').val();

    if (latitude == null || latitude == "" || latitude == undefined) {
      $("#latitude").focus();
      this.swal("Info", "Please enter Latitude", 'info');
      return;
    }

    if (longitude == null || longitude == "" || longitude == undefined) {
      $("#longitude").focus();
      this.swal("Info", "Please enter Longitude", 'info');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to update!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // this.getbyhId.hospital.createdBy = this.user.userId;
        this.hospitaService.saveHosplog(this.user.userId, this.user.userId).subscribe(data => {
          console.log(data.status + ": " + data.message);
        });
        let object = {
          hospitalCode: this.getbyhId.hospital.hospitalCode,
          mobile: this.getbyhId.hospital.mobile,
          emailId: this.getbyhId.hospital.emailId,
          updatedBy: this.user.userId,
          latitude: latitude,
          longitude: longitude
        }
        this.hospitaService.updateHospitalProfile(object).subscribe(
          (result: any) => {
            console.log(result);
            if (result == 1) {
              // this.getGeoLocation();
              this.hospitaService.getbyUserId(this.user.userId).subscribe(
                (result: any) => {
                  this.getbyhId = result;
                  console.log(this.getbyhId);
                  let newlatitude = this.getbyhId.hospital.latitude;
                  let newlongitude = this.getbyhId.hospital.longitude;
                  this.hospitaService.getPosition().then(pos => {
                    console.log(pos);
                    let lt = pos.lat.toString().trim();
                    this.position.latitude = lt.length > 6 ? lt.substring(0, 6) : lt;
                    let lg = pos.lng.toString().trim();
                    this.position.longitude = lg.length > 6 ? lg.substring(0, 6) : lg;
                    if (newlatitude != this.position.latitude || newlongitude != this.position.longitude) {
                      this.swal('Warning', 'Geo Tagging Incorrect. Please Tag Again', 'warning');
                    } else {
                      this.swal('Success', 'Geo-Location Tagged Successfully', 'success');
                      this.closebutton.nativeElement.click();
                    }
                  }, err => {
                    console.log('Error: ');
                    console.log(err);
                    if (err) {
                      this.swal('Warning', 'Please allow location access', 'warning');
                      this.logout();
                    }
                  });
                }
              );
            } else {
              this.swal('Error', 'Some error happened', 'error');
            }
          }
        );
      }
    });
  }

  getMonth() {
    this.userService.getMonths().subscribe(
      (response) => {
        this.months = response;
        console.log(this.months);
        this.userService.getYears().subscribe(
          (data) => {
            this.yearList = data;
            console.log(data);
            // for(var x=this.year;x>=1990;--x) {
            //   this.yearList.push(x);
            // }
            this.monthList = [];
            for (var i = 0; i < this.months.length; i++) {
              if (this.year == this.date.getFullYear()) {
                if (this.months[i].index <= this.date.getMonth()) {
                  this.monthList.push(this.months[i]);
                }
              } else {
                this.monthList.push(this.months[i]);
              }
            }
          },
          (error) => console.log(error)
        )
      },
      (error) => console.log(error)
    )
  }

  getCountDetails() {
    this.monthList = [];
    for (var i = 0; i < this.months.length; i++) {
      if (this.year == this.date.getFullYear()) {
        if (this.months[i].index <= this.date.getMonth()) {
          this.monthList.push(this.months[i]);
        }
      } else {
        this.monthList.push(this.months[i]);
      }
    }

    if (this.year == this.date.getFullYear()) {
      if (parseInt(this.month) - 1 > this.date.getMonth()) {
        let monthId = this.date.getMonth() + 1;
        let checkMonth = monthId.toString();
        if (checkMonth.length == 1) {
          this.month = '0' + monthId;
        } else {
          this.month = monthId;
        }
      }
    }

    let userId = this.user.userId;
    let month = this.month;
    let year = this.year;

    this.claimCount = '';
    let requestData = {
      userId: userId,
      month: month,
      year: year
    };

    console.log(requestData);
    this.reportCount.getHospitalDashboardReport(requestData).subscribe(
      (data) => {
        this.claimCount = data;
        console.log(this.claimCount);
      },
      (error) => {
        console.log(error);
        this.swal('Error', 'Something went wrong.', 'error');
      }
    );
  }

  profile() {
    this.router.navigateByUrl('/application/hospitalprofile');
  }

  logout() {
    sessionStorage.clear();
    this.router.navigateByUrl('/login');
  }

  getResponseFromUtil(parentData: any) {
    this.message = parentData;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  popupNotificationList: any = [];

  notification() {
    this.popupNotificationList = [];
    let groupid = this.user.groupId;
    this.notificationservice.getnotification(groupid).subscribe((respnse: any) => {
      if (respnse.status == "success") {
        this.list = respnse.data;
        this.list.forEach(element => {
          if (element.popupFlag == 0) {
            this.popupNotificationList.push(element);
          }
        });
        if (this.popupNotificationList.length > 0) {
          $('#modalNotify').show();
        }
      }
    })

  }

  downlordnotification(event: any, docpath: any) {
    console.log('file: ' + docpath);
    if (docpath != null && docpath != '' && docpath != undefined) {
      let img = this.notificationservice.downloadFile(docpath);
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }
  modalClose() {
    $('#modalNotify').hide();
  }
}
