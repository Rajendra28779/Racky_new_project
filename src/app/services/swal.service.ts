import { Injectable } from '@angular/core';
import Swal from "sweetalert2";
declare let $: any;

@Injectable({
  providedIn: 'root'
})

/*
Auther: Sambit Kumar Pradhan
Date: 28-Sept-2023
Technology: Angular 10/ Typescript
Purpose: Sweet Alert Service
*/

export class SWALService {

  successSWAL(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    })
  }

  successSWALNoButton(title: string, text: string) {
    Swal.fire({
      position: "center",
      icon: "success",
      title: title,
      text: text,
      showConfirmButton: false,
      timer: 2000,
      allowOutsideClick:false
    });
  }

  successConfirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Ok',
      allowOutsideClick:false
    })
  }

  successConfirmSWALForInfo(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonText: 'Click Here',
      allowOutsideClick:false
    })
  }

  successOTPSentConfirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'Enter OTP',
      showCancelButton: true,
      cancelButtonText: 'Close',
      cancelButtonColor: '#7e7979',
      allowOutsideClick:false
    })
  }

  successConfirmPackageSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      allowOutsideClick:false
    })
  }

  successConfirmPackageSWALWithReq(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showCancelButton: false,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Close',
      allowOutsideClick:false
    })
  }

  errorSWAL(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    })
  }

  warningSWAL(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    })
  }

  warningSWALWithFocous(title: string, text: string,focusId:string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    }).then((result) => {

      if (result.isConfirmed) {
        if(focusId!=null && focusId !=undefined && focusId !=""){
          $("#" + focusId).focus();
        }

      }

    })
  }

  infoSWAL(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    })
  }
infoNotification(){
  const notification = `
  <table border="1" cellpadding="8" cellspacing="0" style="width:100%; border-collapse: collapse;">
    <tr>
      <th style="padding: 10px;text-align: left;background-color: #f2f2f2;width:20%%;   font-weight: bold;">Step</th>
      <th style="padding: 10px;text-align: left;background-color: #f2f2f2; width:80%; font-weight: bold;">Description</th>
    </tr>
    <tr>
      <td style="padding: 6px;text-align: left;width:15%; ">Step 1</td>
      <td style="padding: 5px;text-align: left;width:85%; ">Update New Face Authentication Mobile App.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 2</td>
      <td style="padding: 5px;text-align: left;width:85%;">Now Name has been changed to BSKY Authentication App.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 3</td>
      <td style="padding: 5px;text-align: left;width:85%;">First, from TMS - Hospital Operator needs to send one request.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 4</td>
      <td style="padding: 5px;text-align: left;width:85%;">There is a new screen to send a request, please go to >> <strong>Request-> Hospital authentication</strong>.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 5</td>
      <td style="padding: 5px;text-align: left;width:85%;">Request will be valid for 2 hours from the time of request sent.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 6</td>
      <td style="padding: 10px;text-align: left;width:85%;">Once the request is sent, it will show in the Mobile app for authentication.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 7</td>
      <td style="padding: 10px;text-align: left;width:85%;">Now you can do authentication through FACE / FINGER / IRIS.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 8</td>
      <td style="padding: 10px;text-align: left;width:85%;">For FINGER and IRIS, you need to use an OTG cable to connect with the Mobile app.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 9</td>
      <td style="padding: 10px;text-align: left;width:85%;">Once authenticated in the mobile app, it will be valid for 24 hours.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 10</td>
      <td style="padding: 10px;text-align: left;width:85%;">The operator needs to use the same mode of authentication in TMS as the one used for successful authentication in the Mobile App.</td>
    </tr>
    <tr>
      <td style="padding: 5px;text-align: left;width:15%;">Step 11</td>
      <td style="padding: 10px;text-align: left;width:85%;">If a patient is authenticated through FACE in the app, then you need to select the FACE option in the dropdown in TMS.</td>
    </tr>
  </table>
`;
  Swal.fire({
    title: 'Information',
    html: notification,  // Display all steps in a single alert
    icon: 'info',
    confirmButtonText: 'OK',
    width: '700px', // Adjust the width if needed
    allowOutsideClick:false,
    preConfirm: () => {
      return true;
    }
  });
}
  


  questionSWAL(title: string, text: string) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      confirmButtonText: 'OK',
      allowOutsideClick:false
    })
  }

  confirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      allowOutsideClick:false
    })
  }

  confirmInfoSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Login',
      allowOutsideClick:false
    })
  }

  questionConfirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'No',
      confirmButtonColor: title.toUpperCase() == 'DELETE' ? '#ce0101' : '#6631b6',
      allowOutsideClick:false
    })
  }

  questionConfirmSWAL1(title: any, text: any) {
    return Swal.fire({
      title: title,
      html: `
      System found Ongoing Treatment of this family for another Patient. If you want to continue with this Admission,
      then One Notification will be sent to SHAS for monitoring of this treatment.
      <br><br><b style="color: #05145e">Do You want to Continue?</b>
    `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'No',
      confirmButtonColor: title.toUpperCase() === 'DELETE' ? '#ce0101' : '#6631b6',
      allowOutsideClick: false
    });
  }


  warningConfirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'No',
      confirmButtonColor: title.toUpperCase() == 'DELETE' ? '#ce0101' : '#6631b6',
      allowOutsideClick:false
    })
  }

  wardOccupyingAlert(res: any, selectedWardDetails: any) {
    const wardName = selectedWardDetails?.wardName;
    const bedGiven = res.data.bedGiven;
    const bedOccupied = Number(res.data.bedOccupied) + 1;

    Swal.fire({
      title: 'Ward Status',
      html: `The total bed strength of the ward:
    <b style="color: #044c80">${wardName}</b> is
    <b style="color: #e50101">${bedGiven}</b>,
    but you are trying to occupy :
    <b style="color: #e50101">${bedOccupied}</b>`,
      icon: 'info',
      allowOutsideClick:false
    });
  }

  confirmWardOccupyingAlert(res: any, selectedWardDetails: any) {
    const wardName = selectedWardDetails.wardName;
    const bedGiven = res.data.bedGiven;
    const bedOccupied = Number(res.data.bedOccupied) + 1;

    return Swal.fire({
      title: 'Ward Status',
      html: `The total bed strength of the ward:
    <b style="color: #044c80">${wardName}</b> is
    <b style="color: #e50101">${bedGiven}</b>,
    but you are trying to occupy :
    <b style="color: #e50101">${bedOccupied}</b>`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'No',
      confirmButtonColor: '#6631b6',
      allowOutsideClick:false
    });
  }

  confirmSuccessManualSWAL(title: string, text: string, confirm: string, cancel: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: confirm,
      cancelButtonText: cancel,
      allowOutsideClick:false
    })
  }

  infoConfirmSWAL(title: string, text: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'info',
      confirmButtonText: 'Ok',
      allowOutsideClick:false
    })
  }
}
