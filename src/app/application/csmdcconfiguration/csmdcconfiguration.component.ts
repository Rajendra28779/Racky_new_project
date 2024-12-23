import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DcconfigurationService } from '../Services/dcconfiguration.service';
import { SnocreateserviceService } from '../Services/snocreateservice.service';
import { HeaderService } from '../header.service';
import { Router } from '@angular/router';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DcCdmomappingComponent } from '../dc/dc-cdmomapping/dc-cdmomapping.component';
import { DcCdmomappingService } from '../Services/dc-cdmomapping.service';
declare let $: any;

@Component({
  selector: 'app-csmdcconfiguration',
  templateUrl: './csmdcconfiguration.component.html',
  styleUrls: ['./csmdcconfiguration.component.scss']
})
export class CsmdcconfigurationComponent implements OnInit {
  dcUserId: any;
  latitude: any;
  longitude: any
  datas: any
  hospitalArray: any;
  hosp: any;
  hospObj: any;
  dcId: any;
  csmdcId: any;
  user: any;
  hospList: any = [];
  public stateList: any = [];
  public districtList: any = [];
  public hospitalList: any = [];
  public csmdcList: any = [];
  csmDcForm: FormGroup;
  group:any=22;

  constructor(private dcService: DcconfigurationService,private dccdmoService: DcCdmomappingService,
    private snoService: SnocreateserviceService, public headerService: HeaderService,
    private route: Router, private sessionService: SessionStorageService, private fb: FormBuilder
  ) { this.csmdcId = this.route.getCurrentNavigation().extras.state; }
  ngOnInit(): void {
    this.headerService.setTitle('CSM-DC Or TSU Mapping');
    this.user = this.sessionService.decryptSessionData("user");
    this.getuserDetailsbygroup(22);
    this.getStateList();
    this.csmDcForm = this.fb.group({
      group: [''],
      fullname: ['', Validators.required],
      hospitalStateCode: ['', Validators.required],
      hospitalDistrictCode: ['', Validators.required],
      hospitalCode: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
    });
    if (this.csmdcId) {
      this.getdetailsbyid(this.csmdcId.dcId);
    }
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
  OnChangeState(id: string) {
    localStorage.setItem("stateCode", id);
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => this.districtList = response,
      (error) => console.log(error)
    );
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
  latitudenlaongitudeList: any = [];
  OnChangeHospital(id) {
    const statecode = this.csmDcForm.get('hospitalStateCode')?.value;
    const distcode = this.csmDcForm.get('hospitalDistrictCode')?.value;
    const hospitalCode = this.csmDcForm.get('hospitalCode')?.value;
    this.snoService.gethospitallatitudeandlongitude(id, statecode, distcode, hospitalCode).subscribe(
      (response) => {
        this.latitudenlaongitudeList = response;
        let latitude = this.latitudenlaongitudeList[0][0];
        let longitude = this.latitudenlaongitudeList[0][1];
        this.latitude = latitude;
        this.longitude = longitude;
      },
      (error) => console.log(error)
    )
  }
  editlist: any = [];
  csmdcuserid: any = '';
  hospitalCode: any = '';
  hospitalDistrictCode: any = '';
  hospitalStateCode: any = '';
  fullname: any = '';
  csmdcmappedid: any;
  getdetailsbyid(id: any) {
    this.dcService.saveCSMDCConfigurationLogedit(id).subscribe((res: any) => {
      if (res.status === "success") {
        const detailsArray = JSON.parse(res.details);
        if (detailsArray.length > 0) {
          const details = detailsArray[0];
          this.csmdcuserid = details.csmdcuserid;
          this.latitude = details.latitude;
          this.longitude = details.longitude;
          this.csmdcmappedid = details.csmdcmappedid;
          this.group=details.group
          // Update state and fetch districts
          this.csmDcForm.patchValue({
            fullname: details.csmdcuserid,
            hospitalStateCode: details.hospitalstatecode,
            hospitalCode: details.hospitalcode
          });

          // Set the stateCode first
          this.getuserDetailsbygroup(this.group);
          this.OnChangeState(details.hospitalstatecode);
          this.OnChangeDistrict(details.hospitaldistrictcode);
          // Then set the hospitalDistrictCode, making sure district is in the list
          setTimeout(() => {
            this.csmDcForm.patchValue({
              hospitalDistrictCode: details.hospitaldistrictcode
            });
          }, 100);
        }
      }
    });
  }

  setCsmDcConfiguration(type: String) {
    if (type === 'add') {
      if (this.csmDcForm.valid) {
        let dcId = this.csmDcForm.get('fullname')?.value;
        let hospitalCode = this.csmDcForm.get('hospitalCode')?.value;
        let latitude = this.csmDcForm.get('latitude')?.value;
        let longitude = this.csmDcForm.get('longitude')?.value;

        if ($("#fullname").val() == null || $("#fullname").val() == "" || $("#fullname").val() == undefined) {
          $("#fullname").focus();
          this.swal("Info", "Please select Full Name", 'info');
          return;
        }

        if ($("#hospitalStateCode").val() == null || $("#hospitalStateCode").val() == "" || $("#hospitalStateCode").val() == undefined) {
          $("#hospitalStateCode").focus();
          this.swal("Info", "Please select State Name", 'info');
          return;
        }

        if ($("#hospitalDistrictCode").val() == null || $("#hospitalDistrictCode").val() == "" || $("#hospitalDistrictCode").val() == undefined) {
          $("#hospitalDistrictCode").focus();
          this.latitude='';
          this.longitude='';
          $("#Longitude").val("");
          this.swal("Info", "Please select District Name", 'info');
          return;
        }

        if ($("#hospitalCode").val() == null || $("#hospitalCode").val() == "" || $("#hospitalCode").val() == undefined) {
          $("#hospitalCode").focus();
          this.latitude='';
          this.longitude='';
          this.swal("Info", "Please select Hospital Name", 'info');
          return;
        }


        if ($("#Latitude").val() == null || $("#Latitude").val() == "" || $("#Latitude").val() == undefined) {
          $("#Latitude").focus();
          this.swal("Info", "Please Enter Hospital Latitude", 'info');
          return;
        }


        if ($("#Longitude").val() == null || $("#Longitude").val() == "" || $("#Longitude").val() == undefined) {
          $("#Longitude").focus();
          this.swal("Info", "Please Enter Hospital Longitude", 'info');
          return;
        }

        // Confirmation prompt
        Swal.fire({
          title: 'Are You Sure?',
          text: 'You Want To Save This Data!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Submit It!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.dcService.saveCSMDCConfigurationLog(dcId, hospitalCode, this.user.userId, latitude, longitude).subscribe((res: any) => {
              console.log(res);
              if (res.status === "Success") {
                Swal.fire({
                  title: 'Success',
                  text: res.message,
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.csmDcForm.reset();
                    window.location.reload();
                  }
                });
              } else {
                this.swal(res.status === "exist" ? "Error" : "Error", res.message, "error");
              }
            });
          }
        });
      }

      if ($("#fullname").val() == null || $("#fullname").val() == "" || $("#fullname").val() == undefined) {
        $("#fullname").focus();
        this.swal("Info", "Please select Full Name", 'info');
        return;
      }

      if ($("#hospitalStateCode").val() == null || $("#hospitalStateCode").val() == "" || $("#hospitalStateCode").val() == undefined) {
        $("#hospitalStateCode").focus();
        this.swal("Info", "Please select State Name", 'info');
        return;
      }

      if ($("#hospitalDistrictCode").val() == null || $("#hospitalDistrictCode").val() == "" || $("#hospitalDistrictCode").val() == undefined) {
        $("#hospitalDistrictCode").focus();
        this.swal("Info", "Please select District Name", 'info');
        return;
      }

      if ($("#hospitalCode").val() == null || $("#hospitalCode").val() == "" || $("#hospitalCode").val() == undefined) {
        $("#hospitalCode").focus();
        this.swal("Info", "Please select Hospital Name", 'info');
        return;
      }


      if ($("#Latitude").val() == null || $("#Latitude").val() == "" || $("#Latitude").val() == undefined) {
        $("#Latitude").focus();
        this.swal("Info", "Please Enter Hospital Latitude", 'info');
        return;
      }


      if ($("#Longitude").val() == null || $("#Longitude").val() == "" || $("#Longitude").val() == undefined) {
        $("#Longitude").focus();
        this.swal("Info", "Please Enter Hospital Longitude", 'info');
        return;
      }
    } else if (type === 'upd') {
      if (this.csmDcForm.valid) {
        let dcId = this.csmDcForm.get('fullname')?.value;
        let hospitalCode = this.csmDcForm.get('hospitalCode')?.value;
        let latitude = this.csmDcForm.get('latitude')?.value;
        let longitude = this.csmDcForm.get('longitude')?.value;
        let csmdcmappedid = this.csmdcmappedid

        if ($("#fullname").val() == null || $("#fullname").val() == "" || $("#fullname").val() == undefined) {
          $("#fullname").focus();
          this.swal("Info", "Please select Full Name", 'info');
          return;
        }

        if ($("#hospitalStateCode").val() == null || $("#hospitalStateCode").val() == "" || $("#hospitalStateCode").val() == undefined) {
          $("#hospitalStateCode").focus();
          this.swal("Info", "Please select State Name", 'info');
          return;
        }

        if ($("#hospitalDistrictCode").val() == null || $("#hospitalDistrictCode").val() == "" || $("#hospitalDistrictCode").val() == undefined) {
          $("#hospitalDistrictCode").focus();
          this.swal("Info", "Please select District Name", 'info');
          return;
        }

        if ($("#hospitalCode").val() == null || $("#hospitalCode").val() == "" || $("#hospitalCode").val() == undefined) {
          $("#hospitalCode").focus();
          this.swal("Info", "Please select Hospital Name", 'info');
          return;
        }


        if ($("#Latitude").val() == null || $("#Latitude").val() == "" || $("#Latitude").val() == undefined) {
          $("#Latitude").focus();
          this.swal("Info", "Please Enter Hospital Latitude", 'info');
          return;
        }


        if ($("#Longitude").val() == null || $("#Longitude").val() == "" || $("#Longitude").val() == undefined) {
          $("#Longitude").focus();
          this.swal("Info", "Please Enter Hospital Longitude", 'info');
          return;
        }
        //logic
        // Confirmation prompt
        Swal.fire({
          title: 'Are You Sure?',
          text: 'You Want To Update This Data!',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Update It!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.dcService.saveCSMDCConfigurationLogUpdate(dcId, hospitalCode, this.user.userId, latitude, longitude,csmdcmappedid).subscribe((res: any) => {
              console.log(res);
              if (res.status === "Success") {
                Swal.fire({
                  title: 'Success',
                  text: res.message,
                  icon: 'success',
                  confirmButtonColor: '#3085d6',
                  confirmButtonText: 'OK'
                }).then((result) => {
                  if (result.isConfirmed) {
                    this.csmDcForm.reset();
                    window.location.reload();
                  }
                });
              } else {
                this.swal(res.status === "exist" ? "Error" : "Error", res.message, "error");
              }
            });
          }
        });
      }
      if ($("#fullname").val() == null || $("#fullname").val() == "" || $("#fullname").val() == undefined) {
        $("#fullname").focus();
        this.swal("Info", "Please select Full Name", 'info');
        return;
      }

      if ($("#hospitalStateCode").val() == null || $("#hospitalStateCode").val() == "" || $("#hospitalStateCode").val() == undefined) {
        $("#hospitalStateCode").focus();
        this.swal("Info", "Please select State Name", 'info');
        return;
      }

      if ($("#hospitalDistrictCode").val() == null || $("#hospitalDistrictCode").val() == "" || $("#hospitalDistrictCode").val() == undefined) {
        $("#hospitalDistrictCode").focus();
        this.swal("Info", "Please select District Name", 'info');
        return;
      }

      if ($("#hospitalCode").val() == null || $("#hospitalCode").val() == "" || $("#hospitalCode").val() == undefined) {
        $("#hospitalCode").focus();
        this.swal("Info", "Please select Hospital Name", 'info');
        return;
      }


      if ($("#Latitude").val() == null || $("#Latitude").val() == "" || $("#Latitude").val() == undefined) {
        $("#Latitude").focus();
        this.swal("Info", "Please Enter Hospital Latitude", 'info');
        return;
      }


      if ($("#Longitude").val() == null || $("#Longitude").val() == "" || $("#Longitude").val() == undefined) {
        $("#Longitude").focus();
        this.swal("Info", "Please Enter Hospital Longitude", 'info');
        return;
      }

    } else {
      this.swal("Error", "something Went Wrong", "error");
    }
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }
  onReset() {
    window.location.reload();
  }



}
