import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { HospitalPackageMappingService } from '../../Services/hospital-package-mapping.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-hospital-package-mapping-view',
  templateUrl: './hospital-package-mapping-view.component.html',
  styleUrls: ['./hospital-package-mapping-view.component.scss']
})
export class HospitalPackageMappingViewComponent implements OnInit {
  txtsearchData: any;
  mappingData: any;
  currentPage: any;
  showPegi: boolean;
  record: any;
  pageElement: any;

  report: any[];
  packageMapping: any = {
    Slno: '',
    hospitalName: '',
    packageHeaderName: '',
    packageDetails: '',
    packageSubCategory: '',
  };
  heading = [
    [
      'Sl#',
      'Hospital Name',
      'Package Header',
      'Package SubCategory',
      'Package Details',
    ],
  ];

  constructor(public headerService: HeaderService,
    public hospitalPackageMappingService: HospitalPackageMappingService,
    public router: Router) { }

  ngOnInit(): void {
    this.headerService.setTitle('View Hospital Package Mapping');
    this.currentPage = 1;
    this.pageElement = 10;
    this.getAllPackageMapping();
  }

  getAllPackageMapping() {
    this.hospitalPackageMappingService.getAllHospitalPackageMapping().subscribe((res: any) => {
      this.mappingData = res;
      this.record = this.mappingData.length;
      if (this.record > 0) {
        this.showPegi = true;
      }
      else {
        this.showPegi = false
      }
    })

  }
  edit(id) {
    this.router.navigate(['/application/hospitalpackagemapping', id])
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.hospitalPackageMappingService.deleteHospitalMappingById(id).subscribe((data: any) => {
          if (data.status == "Success") {
            this.swal("Success", data.message, "success");
            this.router.navigate(['/application/hospitalpackagemappingview']);
          } else if (data.status == "Failed") {
            this.swal("Error", data.message, "error");
          }
          this.getAllPackageMapping();
        })

      }
    });

  }
  downloadList() {
    this.report = [];
    let packageP: any;
    for (var i = 0; i < this.mappingData.length; i++) {
      packageP = this.mappingData[i];
      this.packageMapping = [];
      this.packageMapping.Slno = i + 1;
      this.packageMapping.hospitalName = packageP.hospitalCode.hospitalName;
      this.packageMapping.packageHeaderName = packageP.packageHeaderId.packageheadername;
      this.packageMapping.packageSubCategory = packageP.packageSubcategoryId?.packagesubcategoryname;
      this.packageMapping.packageDetails = packageP.packageDetailsId.procedureDescription;
      this.report.push(this.packageMapping);
    }
    TableUtil.exportListToExcel(
      this.report, 'Hospital Package Mapping', this.heading
    );

  }
  pageItemChange() {
    this.pageElement = (<HTMLInputElement>document.getElementById("pageItem")).value;
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

}
