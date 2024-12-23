import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SnocreateserviceService } from 'src/app/application/Services/snocreateservice.service';
import { NavigationExtras, Router } from '@angular/router';
import { deleteUserDetailsforSNO } from 'src/app/services/api-config';
import { HeaderService } from '../../header.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnopipePipe } from '../../pipes/snopipe.pipe';
import { TableUtil } from '../../util/TableUtil';

export class UserDetaisSNOBeans {
  fullName: String;
  userName: string;
  mobileNo: number;
  emailId: string;
  stateName: number;
  districtName: number;
}
@Component({
  selector: 'app-createsnoview',
  templateUrl: './createsnoview.component.html',
  styleUrls: ['./createsnoview.component.scss']
})
export class CreatesnoviewComponent implements OnInit {

  constructor(private SnocreateserviceServ: SnocreateserviceService, private route: Router, public headerService: HeaderService,
    private snopipePipe: SnopipePipe) { }

  record: any;
  currentPage: any;
  pageElement: any;
  showPegi: boolean;
  snoData: any = [];
  stateList: any;
  districtList: any;
  SearchForm: FormGroup;
  Filtered: any;
  stateId: any;
  districtId: any;
  txtsearchDate:any;
  ngOnInit(): void {
    this.headerService.setTitle("SNA Details");
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSNOUserDetails();
    this.getStateList();
    this.SearchForm = new FormGroup({


      'stateId': new FormControl(null, (Validators.required)),
      'districtId': new FormControl(null, (Validators.required))

    });
  }
  getSNOUserDetails() {
    this.SnocreateserviceServ.getSNOUserDetailsData().subscribe((alldta) => {
      console.log("print the data:")
      console.log(alldta);
      this.snoData = alldta;
      this.record = this.snoData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false;
      }
    })
  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }
  // deleteUserDetails(item: any) {
  //   this.SnocreateserviceServ.deleteUserDeatilsSNO(item).subscribe((resp: any) => {
  //     console.log(resp);
  //   }, (err: any) => {
  //   })
  // }
  delete(item: any) {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
       // this.deleteUserDetails(item.bskyUserId);
        //alert(item.userId+':'+item.bskyUserId);
        this.SnocreateserviceServ.deleteSNOuserDetailsData(item.bskyUserId).subscribe(
          (resp: any) => {
            if (resp == 1) {
              Swal.fire(
                'Changed!',
                'Record has been Inactivate.',
                'success'
              )
            }
            this.getSNOUserDetails();;
          },
          (err: any) => {
          }
        )
      }
    })
  }

  resetTable() {
    this.currentPage = 1;
    this.pageElement = 10;
    this.getSNOUserDetails();  
    this.districtList = [];   
  }

  edit(item: any) {
    let objToSend: NavigationExtras = {
      state: {
        bskyUserId: item
      }
    };
    this.route.navigate(['/application/createsno'], objToSend);
  }
  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getStateList() {
    this.SnocreateserviceServ.getStateList().subscribe(
      (response) => {
        this.stateList = response;
        console.log(this.stateList);
      },
      (error) => console.log(error)
    )
  }
  OnChangeState(id) {
    this.SearchForm.controls['districtId'].reset();
    localStorage.setItem("stateCode", id);
    console.log("State Id" + id);

    this.SnocreateserviceServ.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        console.log("State List:")
        console.log(response);
      },
      (error) => console.log(error)
    )
  }

  onChange() {
    this.stateId = this.SearchForm.controls['stateId'].value;
    this.districtId = this.SearchForm.controls['districtId'].value;

    if ((this.stateId == null || this.stateId == "")) {
      Swal.fire("", "Please Select State!!", 'info');
    }
    else if ((this.stateId != null || this.stateId != "null") && (this.districtId == null || this.districtId == "null")) {
      // alert("last two are null !")
      //this.loaderService.showLoader(true);      
      this.snoData = [];
      this.currentPage = 1;
      this.pageElement = 10;
      this.SnocreateserviceServ.getStateListsForFilterForSno(this.stateId).subscribe(
        (data) => {
          this.Filtered = data;

          if (this.Filtered.length != 0) {
            this.snoData = this.snopipePipe.transform(this.snoData, this.Filtered);
            $('#htmlData').show();
          }
          else if (this.Filtered.length <= 0) {
            $('#htmlData').hide();
            Swal.fire("", "No Record Found !", 'info');
          }

        }
      );
      // this.loaderService.showLoader(false);
    }
    //
    //else if (this.schemeId)
    else if ((this.stateId != null || this.stateId != "null") && this.districtId != null) {
      // alert("last two are null !")
      //this.loaderService.showLoader(true);
      this.snoData = [];
      this.currentPage = 1;
      this.pageElement = 10;
      this.SnocreateserviceServ.getDistrictListsForFiltersForSno(this.stateId, this.districtId).subscribe(
        // (data) => {
        //   this.Filtered = data;
        //   this.viewList = this.districtMappingsPipePipe.transform(this.viewList, this.Filtered);
        // }
        (data) => {
          this.Filtered = data;
          if (this.Filtered.length != 0) {
            this.snoData = this.snopipePipe.transform(this.snoData, this.Filtered);
            $('#htmlData').show();
          }
          // else {
          //   $('#thtmlData').hide();
          //  Swal.fire("", "Data Not Available !! ", 'info');
          // }
          else if (this.Filtered.length <= 0) {
            $('#htmlData').hide();
            Swal.fire("", "No Record Found !", 'info');
          }

        }

      );
      //this.loaderService.showLoader(false);
    }



  }

  report: any = [];
  sno: any = {
    slNo: "",
    fullname: "",
    userName: "",
    mobile: "",
    email: "",
    state: "",
    district: "",
    status: "",
  };  
  heading = [['Sl No', 'Full Name', 'Username', 'Mobile No', 'Email Id', 'State', 'District', 'Status']];

  downloadReport() {
    //console.log(this.snoData);
    this.report = [];
    let item: any;
    for(var i=0;i<this.snoData.length;i++) {
      item = this.snoData[i];
      console.log(item);
      this.sno = [];
      this.sno.slNo = i+1;
      this.sno.fullname = item.fullName;
      this.sno.userName = item.username;
      this.sno.mobile = item.mobileNo;
      this.sno.email = item.emailId;
      this.sno.state = item.stateName;
      this.sno.district = item.districtName;
      if(item.status == '0') {
        this.sno.status = "Active";
      } else if(item.status == '1') {
        this.sno.status = "Inactive";
      }
      this.report.push(this.sno);
      console.log(this.report);
      console.log(this.sno);
    }
    TableUtil.exportListToExcel(this.report, "SNA Details", this.heading);
  }

}
