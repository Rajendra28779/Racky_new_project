import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../header.service';
import { RemarksMasterService } from '../../Services/remarks-master.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-remarks-view',
  templateUrl: './remarks-view.component.html',
  styleUrls: ['./remarks-view.component.scss']
})
export class RemarksViewComponent implements OnInit {
  remarkView: any;
  currentPage: any;
  pageElement: any;
  txtsearchDate: any;
  showPegi: boolean;
  record: any;
  constructor(public headerService: HeaderService,
    public remarksMasterService: RemarksMasterService,
    public fb: FormBuilder,
    public router: Router,
    //public packageDetailsMasterService: PackageDetailsMasterService,
    private activeroute: ActivatedRoute) { }

  ngOnInit(): void {
    this.headerService.setTitle('Remarks Master');
    this.getAllremarksData();
  }
  getAllremarksData() {
    this.remarksMasterService.getallRemarkData().subscribe((data: any) => {
      this.remarkView = data;

      this.record = this.remarkView?.length;
      if (this.record > 0) {
        this.currentPage = 1;
        this.pageElement = 10;
        this.showPegi = true;
      }
    });
  }
  pageItemChange() { }
  edit(id: any) {
    this.router.navigate(['/application/remarks', id]);
  }
  onPageBoundsCorrection($event) { }
}
