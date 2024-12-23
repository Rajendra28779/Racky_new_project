import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../header.service';
import { PreauthService } from '../Services/preauth.service';

@Component({
  selector: 'app-assembly-constituency-report',
  templateUrl: './assembly-constituency-report.component.html',
  styleUrls: ['./assembly-constituency-report.component.scss']
})
export class AssemblyConstituencyReportComponent implements OnInit {
  constructor(private headerService: HeaderService, public preauthService: PreauthService) { }
  ngOnInit(): void {
    this.headerService.setTitle('Assembly Constituency Information ');
    this.getAssemblyConstituencyReport();
  }

  mainArr: any[] = [];
  getAssemblyConstituencyReport() {
    this.preauthService.getgetAssemblyConstituencyReport().subscribe((data: any) => {
      this.mainArr = [];
      let dataArr: any[] = data?.data?.data;
      let detailsArr: any[] = data?.data?.details;
      dataArr.forEach((dataItem: any) => {
        const matchedArr:any[] = detailsArr.filter((detailsItem: any) => dataItem?.lgdcode === detailsItem?.lgdcode);
        dataItem.details = matchedArr;
        this.mainArr.push(dataItem);
      });
    })
  }
}

