import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { WardMasterService } from '../../Services/ward-master.service';
import Swal from 'sweetalert2';
import { TableUtil } from '../../util/TableUtil';

@Component({
  selector: 'app-ward-master-view',
  templateUrl: './ward-master-view.component.html',
  styleUrls: ['./ward-master-view.component.scss']
})
export class WardMasterViewComponent implements OnInit {
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  wardView: any;

  report: any[];
 
 ward: any = {
    Slno: '',
    procedureCode:'',
    wardCode:'',
    wardName:'',
    unit:'',
    maximumUnit:'',
    unitcyclePrice:'',
    pricefixedEditable:'',
  };
  heading = [
    [
      'Sl#',
      'Procedure Code',
      'Ward Code',
      'Ward Name',
      'Unit',
      'Maximum Unit',
      'Unitcycle Price',
      'Pricefixed Editable',
    ],
  ];
  constructor(public headerService: HeaderService,
    public wardMasterService: WardMasterService,
    public fb: FormBuilder,
    public router: Router,
    //public packageDetailsMasterService: PackageDetailsMasterService,
    private activeroute: ActivatedRoute ) { }

  ngOnInit(): void {
    this.headerService.setTitle('Ward Master');
    this.getallData();
  }
  getallData() {
    this.wardMasterService.getalldata().subscribe((data: any) => {
      this.wardView = data;

      this.record = this.wardView?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      }
    });
  }
 
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
        this.wardMasterService.deleteward(item).subscribe((data: any) => {
          if (data == 1) {
            Swal.fire(
              'Deleted!',
              'Record has been Inactivate.',
              'success'
            )
          }
          this.getallData();
          (err: any) => {
          }
        })
      }
    })
  }
  edit(wardMasterId: any) {
    this.router.navigate(['/application/wardAdd', wardMasterId]);
  }
  downloadList(){
    this.report = [];
    let packageP:any;
    for (var i = 0; i < this.wardView.length; i++) {
      packageP = this.wardView[i];
      this.ward = [];
      this.ward.Slno = i + 1;
      this.ward.procedureCode=packageP.procedureCode;
      this.ward.wardCode=packageP.wardCode;
      this.ward.wardName=packageP.wardName;
      this.ward.unit=packageP.unit;
      this.ward.maximumUnit=packageP.maximumUnit;
      this.ward.unitcyclePrice=packageP.unitCyclePrice;
      this.ward.pricefixedEditable=packageP.priceFixedEditable;
      this.report.push(this.ward);
    }
    TableUtil.exportListToExcel(
      this.report, 'Ward Master', this.heading
    );
 }
 

}
