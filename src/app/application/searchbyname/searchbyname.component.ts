import { formatDate } from '@angular/common';
import { AbstractType, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jspdf from 'jspdf';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { JwtService } from 'src/app/services/jwt.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { HealthDeptDtlAdauthServiceService } from '../Services/health-dept-dtl-adauth-service.service';
import { TableUtil } from '../util/TableUtil';
import { HeaderService } from './../header.service';
import html2canvas from 'html2canvas';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { PackageDetailsMasterService } from '../Services/package-details-master.service';

@Component({
  selector: 'app-searchbyname',
  templateUrl: './searchbyname.component.html',
  styleUrls: ['./searchbyname.component.scss'],
})
export class SearchbynameComponent implements OnInit {
  user: any;
  public districtList: any = [];
  showtable: any = false;
  txtsearchDate: any;
  list: any = [];
  showPegi: boolean;
  currentPage: any;
  pageElement: any;
  totalcount: any = 0;
  distid: any;
  searchtype: any;
  textvalue: any;
  distname: any = 'All';
  dataResult: any;

  constructor(
    public headerService: HeaderService,
    private jwtService: JwtService,
    public route: Router,
    public rationcardserv: HealthDeptDtlAdauthServiceService,
    private sessionService: SessionStorageService,
    private encryptionService: EncryptionService,
    public packageDetailsMasterService: PackageDetailsMasterService
  ) {}

  ngOnInit(): void {
    this.headerService.setTitle('Beneficiary Search By Name');
    this.user = this.sessionService.decryptSessionData('user');
    this.getnfasdistrictlist();
    this.getSchemeData();
    this.getSchemeDetails();
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
    });
  }

  getnfasdistrictlist() {
    $('#districtId').val('');
    this.rationcardserv.getDistrictListofnfsa().subscribe(
      (response) => {
        this.districtList = response;
      },
      (error) => console.log(error)
    );
  }

  getReset() {
    $('#districtId').val('');
    $('#searchtype').val('');
    $('#textdata').val('');
    this.showtable = false;
  }
  Search() {
    this.distid = $('#districtId').val();
    this.searchtype = $('#searchtype').val();
    this.textvalue = $('#textdata').val().toString().trim();
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemeCategoryIdValue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    if (
      this.searchtype == '' ||
      this.searchtype == null ||
      this.searchtype == undefined
    ) {
      this.swal('Info', 'Please Fill Search Type !', 'info');
      return;
    }

    if (
      this.textvalue == '' ||
      this.textvalue == null ||
      this.textvalue == undefined
    ) {
      this.swal('Info', 'Please Enter The text Field !', 'info');
      return;
    }

    if (this.searchtype == 1 && this.textvalue.length <= 3) {
      this.swal(
        'Info',
        'Field Value Must be greater Then 3 Charcter !',
        'info'
      );
      return;
    } else if (this.searchtype == 2 && this.textvalue.length != 10) {
      this.swal('Info', 'Please Provide a valid Mobile No !', 'info');
      return;
    } else if (this.searchtype == 3 && this.textvalue.length != 12) {
      this.swal('Info', 'Please Provide a valid Aadhar No !', 'info');
      return;
    }

    this.dataResult = this.textvalue;

    this.rationcardserv
      .searchbyname(this.distid, this.searchtype, this.textvalue,schemeid, schemecategoryid)
      .subscribe(
        (data: any) => {
          this.list = data;
          this.totalcount = this.list.length;
          if (this.totalcount > 0) {
            this.showPegi = true;
            this.currentPage = 1;
            this.pageElement = 100;
            this.showtable = true;
          } else {
            this.showPegi = false;
            this.swal('Info', 'NO Record Found !', 'info');
          }
        },
        (error) => console.log(error)
      );
  }

  report: any = [];
  heading = [
    [
      'Sl#',
      'District Name',
      'Block Name',
      'Panchayat/Word Name',
      'Village Name',
      'URN',
      'Full Name',
      'Mobile No',
      'Aadhar No',
      'Gender',
      'Age',
      'Family Head Name',
      'Relation with Family Head',
      'Ration Card Type',
      'FPS name',
    ],
  ];
  sno: any = {
    Slno: '',
    distname: '',
    block: '',
    word: '',
    village: '',
    urn: '',
    fullname: '',
    mobileno: '',
    aadharno: '',
    gender: '',
    age: '',
    familyhead: '',
    relation: '',
    cardtype: '',
    fps: '',
  };

  downloadList(no: any) {
    this.report = [];
    let sna: any;
    for (var i = 0; i < this.list.length; i++) {
      sna = this.list[i];
      this.sno = [];
      this.sno.Slno = i + 1;
      this.sno.distname = sna.dist;
      this.sno.block = sna.block;
      this.sno.word = sna.word;
      this.sno.village = sna.village;
      this.sno.urn = sna.cardno;
      this.sno.fullname = sna.fullname;
      this.sno.mobileno = sna.mobileno;
      this.sno.aadharno = sna.adharno;
      this.sno.gender = sna.gender;
      this.sno.age = sna.age;
      this.sno.familyhead = sna.headName;
      this.sno.relation = sna.relation;
      this.sno.cardtype = sna.cardtype;
      this.sno.fps = sna.fpsname;
      this.report.push(this.sno);
    }

    for (let j = 0; j < this.districtList.length; j++) {
      if (this.districtList[j].districtcode == this.distid) {
        this.distname = this.districtList[j].districtname;
      }
    }
    let searchtype = '';
    if (this.searchtype == 1) {
      searchtype = 'Name';
    } else if (this.searchtype == 2) {
      searchtype = 'Mobile No';
    } else if (this.searchtype == 3) {
      searchtype = 'Aadhaar Card No.';
    } else if (this.searchtype == 4) {
      searchtype = 'URN';
    } else {
      searchtype = 'ALL';
    }

    if (no == 1) {
      let filter = [];
      filter.push([['Distrct Name', this.distname]]);
      filter.push([['Search type', searchtype]]);
      filter.push([['Text Value', this.textvalue]]);
      TableUtil.exportListToExcelWithFilter(
        this.report,
        'Beneficiary Search By Name Report',
        this.heading,
        filter
      );
    } else {
      let generatedOn = formatDate(
        new Date(),
        'dd-MMM-yyyy hh:mm:ss a',
        'en-US'
      ).toString();
      let generatedBy = this.user.fullName;
      if (this.report == null || this.report.length == 0) {
        this.swal('Info', 'No Record Found', 'info');
        return;
      }
      var doc = new jsPDF('l', 'mm', [320, 210]);
      doc.setFontSize(20);
      doc.text('Beneficiary Search By Name Report', 120, 15);
      doc.setFontSize(12);
      doc.text('Distrct Name :- ' + this.distname, 15, 25);
      doc.text('Search type :- ' + searchtype, 110, 25);
      doc.text('Text Value :- ' + this.textvalue, 200, 25);
      doc.text('GeneratedOn :- ' + generatedOn, 200, 33);
      doc.text('GeneratedBy :- ' + generatedBy, 15, 33);
      var rows = [];
      for (var i = 0; i < this.report.length; i++) {
        var clm = this.report[i];
        var pdf = [];
        pdf[0] = clm.Slno;
        pdf[1] = clm.distname;
        pdf[2] = clm.block;
        pdf[3] = clm.word;
        pdf[4] = clm.village;
        pdf[5] = clm.urn;
        pdf[6] = clm.fullname;
        pdf[7] = clm.mobileno;
        pdf[8] = clm.aadharno;
        pdf[9] = clm.gender;
        pdf[10] = clm.age;
        pdf[11] = clm.familyhead;
        pdf[12] = clm.relation;
        pdf[13] = clm.cardtype;
        pdf[14] = clm.fps;
        rows.push(pdf);
      }
      autoTable(doc, {
        head: this.heading,
        body: rows,
        theme: 'grid',
        startY: 40,
        headStyles: {
          fillColor: [26, 99, 54],
        },
        columnStyles: {
          0: { cellWidth: 10 },
        },
      });
      doc.save('Beneficiary Search By Name Report.pdf');
    }
  }

  onaction(urn: any) {
    localStorage.setItem('urnno', urn);
    localStorage.setItem('schemeId', this.schemeidvalue);
    localStorage.setItem('schememCategoryId', this.schemeCategoryIdValue);
    localStorage.setItem('token', this.jwtService.getJwtToken());
    this.route.navigate([]).then((result) => {
      window.open(environment.routingUrl + '/treatmenthistoryofurn');
    });
  }

  response: any;
  cardbalance: any;
  urn: any;
  balance(urn: any) {
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemeCategoryIdValue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.urn = urn;
    this.rationcardserv
      .checkcardbalance(urn, 'A', schemeid, schemecategoryid)
      .subscribe((data: any) => {
        this.response = data;
        if (this.response.cardbalance.length > 0) {
          this.cardbalance = this.response.cardbalance[0];
        }
      });
  }

  show: any = false;
  family: any = [];
  benific: any;
  carddetails(urn: any) {
    let schemeid = this.schemeidvalue;
    let schemecategoryid = this.schemeCategoryIdValue;
    if (schemecategoryid == null || schemecategoryid == undefined || schemecategoryid == '') {
      schemecategoryid = "";
    } else {
      schemecategoryid = schemecategoryid;
    }
    this.rationcardserv
      .getcarddetailsthroughurn(urn, 'A',schemeid, schemecategoryid)
      .subscribe((data: any) => {
        this.show = true;
        this.family = data.family;
        this.benific = data.benificiary;
      });
  }

  print() {
    const element = document.getElementById('modalbody');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('Card_Details_of_URN_' + this.benific.cardno + '.pdf');
    });
  }
  scheme: any;
  schemeidvalue: any;
  schemeName: any;
  getSchemeData() {
    let data = {
      action: 'A',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.scheme = resData.data;
          for (let i = 0; i < this.scheme.length; i++) {
            this.schemeidvalue = this.scheme[i].schemeId;
            this.schemeName = this.scheme[i].schemeName;
          }
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }
  schemeList: any = [];
  getSchemeDetails() {
    let data = {
      action: 'B',
      schemeId: 1,
      schemeCategoryId: '',
    };
    let encData = this.encryptionService.encryptRequest(data);
    this.packageDetailsMasterService.getSchemeDetails(encData).subscribe(
      (res: any) => {
        let resData = this.encryptionService.getDecryptedData(res);
        if (resData.status == 'success') {
          this.schemeList = resData.data;
        } else {
          this.swal('', 'Something went wrong.', 'error');
        }
      },
      (error) => {
        this.swal('', 'Something went wrong.', 'error');
      }
    );
  }

  schemeCategoryIdValue: any
  schemecategoryName: any;
  getschemacategoryid(event: any) {
    if (event != null && event != undefined && event != '' && event != "") {
      for (let i = 0; i < this.schemeList.length; i++) {
        if (event == this.schemeList[i].schemeCategoryId)
          this.schemeCategoryIdValue = this.schemeList[i].schemeCategoryId;
        this.schemecategoryName = this.schemeList[i].categoryName;
      }
    } else {
      this.schemeCategoryIdValue = '';
      this.schemecategoryName = "All"
    }
  }
}
