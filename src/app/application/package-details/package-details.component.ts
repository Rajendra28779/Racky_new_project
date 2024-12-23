import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HeaderService } from '../header.service';
import { CreatecpdserviceService } from '../Services/createcpdservice.service';

@Component({
  selector: 'app-package-details',
  templateUrl: './package-details.component.html',
  styleUrls: ['./package-details.component.scss']
})
export class PackageDetailsComponent implements OnInit {

  packCatCode: any;
  packCode: any;
  token: any;
  packageData: any;


  constructor(public headerService: HeaderService,private cpdService: CreatecpdserviceService,) { }

  ngOnInit(): void {

    this.packCode = localStorage.getItem("packageCode");
    this.packCatCode = localStorage.getItem("packageCatCode");
    this.token = localStorage.getItem("token");

    this.getPackeDetails();

  }

  getPackeDetails() {
    let packageId = this.packCode;
    let procedureCode = this.packCatCode;
    this.cpdService.getPackeDetails(packageId,procedureCode).subscribe(data => {
      let resData = data;
      if (resData.status == "success"){
        this.packageData = resData.packageDetails;
      //console.log(this.packageData);
      localStorage.removeItem("packageCode");
      localStorage.removeItem("packageCatCode");
    }else {
          this.swal('', 'No Data Found.', 'error');
          localStorage.removeItem("packageCode");
          localStorage.removeItem("packageCatCode");
       }

      },
      (error) => {
       console.log(error);
         this.swal('', 'No Data Found.', 'error');
         localStorage.removeItem("packageCode");
         localStorage.removeItem("packageCatCode");
      });
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }


}
