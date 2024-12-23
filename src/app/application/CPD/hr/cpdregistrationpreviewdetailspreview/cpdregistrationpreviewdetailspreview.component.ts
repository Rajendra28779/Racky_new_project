import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdregsdetailsPreviewService } from 'src/app/application/Services/cpdregsdetails-preview.service';
import { HeaderService } from 'src/app/application/header.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import Swal from 'sweetalert2';
import { Location } from '@angular/common';
@Component({
  selector: 'app-cpdregistrationpreviewdetailspreview',
  templateUrl: './cpdregistrationpreviewdetailspreview.component.html',
  styleUrls: ['./cpdregistrationpreviewdetailspreview.component.scss']
})
export class CpdregistrationpreviewdetailspreviewComponent implements OnInit {

  cpdUserId: any;
  cpdUserDetails: any;
  basicDetailsData: any;
  addressDetailsData: any;
  professionalQuaDataList: any;
  experienceDataList: any;
  image: any;
  profilePhoto: any = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  profileSignature: any = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  isImage: boolean;
  formattedDateTime: any;
  showDownloadIcon: boolean = true;
  data: any;
  constructor(private location: Location,
    private route: Router,
    private sessionService: SessionStorageService,
    private datePipe: DatePipe,
    private cpdregpreviewserv: CpdregsdetailsPreviewService,
  ) { }

  ngOnInit(): void {
    this.data = localStorage.getItem('actionData');
    console.log(this.data);
    this.cpdUserId = Number(this.data);
    console.log(this.cpdUserId);
    window.addEventListener('afterprint', () => {
      this.showDownloadIcon = true; // Restore the visibility of the download icon after printing is cancelled
    });
    this.getCPDRegDetails();
    const currentDate = new Date();
    this.formattedDateTime = this.datePipe.transform(currentDate, 'dd-MMM-yyyy HH:mm');
    console.log(this.formattedDateTime);
  }
  profDataList: any = [];
  basicDtlsData: any = [];
  addsDetailsData: any = [];
  experList: any = [];
  speciaList: any = [];
  getCPDRegDetails() {
    this.cpdregpreviewserv
      .previewData(this.cpdUserId)
      .subscribe((details: any) => {
        console.log(details);
        let data = JSON.parse(details.details);
        console.log(data);
        // Assuming details is already a JavaScript object
        this.profDataList = data.professionalQuaDataList;
        console.log(this.profDataList);
        this.basicDtlsData = data.basicDetailsData;
        console.log(this.basicDtlsData);
        this.addsDetailsData = data.addressDetailsData;
        console.log(this.addsDetailsData);
        this.experList = data.experienceDataList;
        this.speciaList = data.spcialityDetailList;
        this.getImageFile('profilephoto', this.basicDtlsData.photograph);
        this.getImageFile('signaturedoc', this.basicDtlsData.signatureDoc);
      },
        (error) => {
          console.log(error);
        });

  }

  backClicked() {
    // this.route.navigate(['/trackstatus']);
    this.location.back();

  }

  printPage() {
    this.showDownloadIcon = false; // Hide the download icon when printing
  }

  prefixname;
  downloadfileCpdRegistration(prefix: any, filename: any) {
    console.log(this.prefixname);
    this.prefixname = prefix;
    console.log(filename);
    if (filename != null && filename != '' && filename != undefined) {
      let img = this.cpdregpreviewserv.downloadfileCpdRegistration(filename, prefix, this.cpdUserId);
      this.image = img;
      window.open(img, '_blank');
    } else {
      this.swal('Info', 'There Is No File', 'info');
    }
  }

  swal(title: any, text: any, icon: any) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  getImageFile(prefix: any, filename: any) {
    this.cpdregpreviewserv.downloadfileCpdRegistration1(filename, prefix, this.cpdUserId)
      .subscribe((res: any) => {
        let blob = new Blob([res], { type: res.type });
        if (blob.size > 0) {
          let reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = (_event) => {
            if (prefix == "profilephoto")
              this.profilePhoto = reader.result;
            else
              this.profileSignature = reader.result;
          }
        } else {
          if (prefix == "profilephoto")
            this.profilePhoto = 'http://bootdey.com/img/Content/avatar/avatar1.png';
          else
            this.profileSignature = 'http://bootdey.com/img/Content/avatar/avatar1.png';
        }
      })
  }



}
