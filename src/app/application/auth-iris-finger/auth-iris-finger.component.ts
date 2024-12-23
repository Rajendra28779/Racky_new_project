import { Component, OnInit, ViewChild } from '@angular/core';
import { catchError, Subscription } from 'rxjs';
import { AuthIrisFingerService } from 'src/app/services/auth-iris-finger.service';
import { EncryptionService } from 'src/app/services/encryption.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { LoginService } from 'src/app/services/shared-services/login.service';
import { SWALService } from 'src/app/services/swal.service';
import Swal from 'sweetalert2';
declare let $: any;
@Component({
  selector: 'app-auth-iris-finger',
  templateUrl: './auth-iris-finger.component.html',
  styleUrls: ['./auth-iris-finger.component.scss'],
})
export class AuthIrisFingerComponent implements OnInit {
  @ViewChild('irisFingerButton') irisFingerBtn: any;
  @ViewChild('irisCloseButton') irisFingerClsBtn: any;
  user: any;
  sharedData:any;
  constructor(
    private encryptionService: EncryptionService,
    private swalService: SWALService,
    private service: LoginService,
    private sessionService: SessionStorageService,
    private irisService: AuthIrisFingerService
  ) {}
  irisSubscription: Subscription;
  ngOnInit(): void {
    this.user = this.sessionService.decryptSessionData('user');
    this.getFingerDeviceList();
    this.irisSubscription = this.irisService.message$.subscribe((res) => {
      console.log(res);
      this.sharedData = res;
      $("#verificationAuthCheckbox").prop("checked", false);
      this.isDeclarationValid=false;
      $("#btnFINGER").prop('selectedIndex', 0);
      $("#btnIRIS").prop('selectedIndex', 0);
      this.irisFingerBtn.nativeElement.click();
    });
  }
  isDeclarationValid: any;
  checkDeclaration(event: any) {
    this.isDeclarationValid = event.target.checked;
  }
  authType: any;
  verificationMode: any = 0;

  generateIRIS(event: any, authType: any) {
    if (!this.isDeclarationValid) {
      $('#verificationAuthCheckbox').focus();
      this.swalService.infoSWAL(
        'Declaration Required',
        'Please check aadhaar consent!'
      );
      event.target.value = 0;
      return;
    }
    let deviceId = event.target.value;
    this.authType = authType;
    this.verificationMode = 2;
    $('#btnAuthentication').hide();

    if (event.target.value == 1) {
      $('#IRISbtn').click();
      this.discoverRDService();
    } else if (event.target.value == 2) {
      $('#IRISbtn').click();
      this.discoverMantraDevice();
    } else this.swalService.infoSWAL('Info', 'Please select a device!');
  }
  discoverRDService() {
    const primaryUrl =
      window.location.protocol !== 'https:'
        ? 'http://localhost'
        : 'https://localhost';
    $('#getrdresponse').html(primaryUrl);
    let tempcount = 0;
    for (var i = 11100; i <= 11120; i++) {
      var res;
      $.support.cors = true;
      let httpStaus = false;
      let xmlstr = '';
      let RDurl = primaryUrl + ':' + i.toString();
      $.ajax({
        type: 'RDSERVICE',
        async: false,
        crossDomain: true,
        url: RDurl,
        contentType: 'text/xml; charset=utf-8',
        processData: false,
        cache: false,
        beforeSend: function () {
          $('#loader').show();
        },
        success: function (data: any) {
          try {
            xmlstr = data.xml
              ? data.xml
              : new XMLSerializer().serializeToString(data);
            data = xmlstr;
            let xmlDoc = $.parseXML(data);
            let $xml = $(xmlDoc);
            let Name = $xml.find('RDService').attr('status');
            let info = $xml.find('RDService').attr('info');
            $('#rdStatus').val(Name);
            $('#rdinfo').val(info);
            if ('Biomatiques Iris (Model: EPI-1000)' == info) {
              i = 11130;
            }
            if (Name == 'READY') {
              sessionStorage.setItem('rdURL', RDurl);
              $('#btnMantra').hide();
              $('#btnFinger').hide();
              $('#btnFinger1').hide();
              $('#btnBiomatique').show();
            } else {
              $('#btnMantra').hide();
              $('#btnFinger').hide();
              $('#btnFinger1').hide();
              $('#btnBiomatique').hide();
            }
            httpStaus = true;
            res = { httpStaus: httpStaus, data: data };
            tempcount++;
          } catch (e) {
            console.log(e);
          }
        },
        complete: function () {
          $('#loader').hide();
        },
        error: function (jqXHR: any, ajaxOptions: any, thrownError: any) {
          console.log(
            'JQ XHR',
            jqXHR + 'Ajax Options' + ajaxOptions + 'Thrown Error' + thrownError
          );
        },
      });
    }
    this.deviceInfo();
    return res;
  }
  discoverMantraDevice() {
    // debugger;
    let capture = this;
    let status = false;
    let MethodCapture = '';
    let MethodInfo = '';
    let GetCustomDomName = '127.0.0.1';
    let OldPort = false;
    let primaryUrl = 'http://' + GetCustomDomName + ':';
    try {
      let protocol = window.location.href;
      if (protocol.indexOf('https') >= 0) {
        primaryUrl = 'https://' + GetCustomDomName + ':';
      }
    } catch (e) {}
    let url = '';
    $('#rdStatus').val('');
    for (let i: any = 11100; i <= 11120; i++) {
      if (status === false) {
        if (primaryUrl == 'https://' + GetCustomDomName + ':' && OldPort) {
          i = '8005';
        }
        $('#lblStatus1').text(
          'Discovering RD service on port : ' + i.toString()
        );
        var res;
        $.support.cors = true;
        let httpStaus = false;
        $.ajax({
          type: 'RDSERVICE',
          async: false,
          crossDomain: true,
          url: primaryUrl + i.toString(),
          contentType: 'text/xml; charset=utf-8',
          processData: false,
          cache: false,
          success: function (data: any) {
            httpStaus = true;
            res = { httpStaus: httpStaus, data: data };
            // debugger;
            let finalUrl = primaryUrl + i.toString();
            let $doc = $.parseXML(data);
            let CmbData1 = $($doc).find('RDService').attr('status');
            let CmbData2 = $($doc).find('RDService').attr('info');
            if (RegExp('\\b' + 'Mantra' + '\\b').test(CmbData2) == true) {
              //Iris Device
              if (
                RegExp('\\b' + 'Iris' + '\\b').test(CmbData2) == true &&
                capture.authType === 'IRIS'
              ) {
                $('#rdStatus').val(CmbData1);
                $('#rdinfo').val(CmbData2);
                $('#rdport').val(i.toString());
                if (
                  $($doc).find('Interface').eq(0).attr('path') == '/rd/capture'
                ) {
                  MethodCapture = $($doc).find('Interface').eq(0).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(1).attr('path') == '/rd/capture'
                ) {
                  MethodCapture = $($doc).find('Interface').eq(1).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(0).attr('path') == '/rd/info'
                ) {
                  MethodInfo = $($doc).find('Interface').eq(0).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(1).attr('path') == '/rd/info'
                ) {
                  MethodInfo = $($doc).find('Interface').eq(1).attr('path');
                }
                if (CmbData1 == 'READY') {
                  sessionStorage.setItem('rdURL', finalUrl);
                  $('#btnMantra').show();
                  $('#btnFinger').hide();
                  $('#btnBiomatique').hide();
                  $('#btnFinger1').hide();
                  status = true;
                  capture.deviceInfoMantra();
                } else {
                  $('#btnBiomatique').hide();
                  $('#btnFinger').hide();
                  $('#btnFinger1').hide();
                  $('#btnMantra').hide();
                } //end Ready State
                return;
              }
              //Mantra Device
              else if (
                RegExp('\\b' + 'Iris' + '\\b').test(CmbData2) == false &&
                capture.authType === 'FINGER'
              ) {
                $('#rdStatus').val(CmbData1);
                $('#rdinfo').val(CmbData2);
                $('#rdport').val(i.toString());
                if (
                  $($doc).find('Interface').eq(0).attr('path') == '/rd/capture'
                ) {
                  MethodCapture = $($doc).find('Interface').eq(0).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(1).attr('path') == '/rd/capture'
                ) {
                  MethodCapture = $($doc).find('Interface').eq(1).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(0).attr('path') == '/rd/info'
                ) {
                  MethodInfo = $($doc).find('Interface').eq(0).attr('path');
                }
                if (
                  $($doc).find('Interface').eq(1).attr('path') == '/rd/info'
                ) {
                  MethodInfo = $($doc).find('Interface').eq(1).attr('path');
                }
                if (CmbData1 == 'READY') {
                  sessionStorage.setItem('rdURL', finalUrl);
                  $('#btnFinger').show();
                  $('#btnMantra').hide();
                  $('#btnBiomatique').hide();
                  $('#btnFinger1').hide();
                  status = true;
                  capture.deviceInfoMantra();
                } else {
                  $('#btnBiomatique').hide();
                  $('#btnFinger').hide();
                  $('#btnFinger1').hide();
                  $('#btnMantra').hide();
                } //end Ready State
                return;
              }
            }
          },
          error: function (jqXHR: any, ajaxOptions: any, thrownError: any) {
            if (i == '8005' && OldPort == true) {
              OldPort = false;
              i = '11099';
            }
          },
          complete: function () {
            $('#loader').hide();
          },
        });
      }
    }
    // this.deviceInfoMantra();
    return res;
  }
  deviceInfo() {
    let primaryUrl = sessionStorage.getItem('rdURL');
    sessionStorage.removeItem('rdInfo');
    let urlInfo = primaryUrl + '/BISPL/info';
    $('#getrdresponse').html('');
    let xmlstr = '';
    let RDurl = urlInfo;

    $.ajax({
      type: 'DEVICEINFO',
      async: false,
      crossDomain: true,
      url: RDurl,
      contentType: 'text/xml; charset=utf-8',
      processData: false,
      cache: false,
      success: function (data: any) {
        try {
          xmlstr = data.xml
            ? data.xml
            : new XMLSerializer().serializeToString(data);

          data = xmlstr;
          let xmlDoc = $.parseXML(data);
          let $xml = $(xmlDoc);
          let deviceName = $xml.find('DeviceInfo').attr('dpId');
          let deviceModel = $xml.find('DeviceInfo').attr('mi');
          let mc = $xml.find('DeviceInfo').attr('mc');
          let additional_info = $xml.find('DeviceInfo').find('additional_info');
          let outerHTML = additional_info[0].outerHTML;
          let deviceSerialNo = $(outerHTML).find('Param').attr('value'); //srno

          let irisObject = {
            deviceName: deviceName,
            deviceSerialNo: deviceSerialNo,
            deviceModel: deviceModel,
          };
          sessionStorage.setItem('irisObject', JSON.stringify(irisObject));

          $('#mi').val(deviceModel);
          $('#mc').val(mc);
          $('#dpid').val(deviceName);
          $('#rdInfo').val(data);

          this.rdInfos = data;
          sessionStorage.setItem('rdInfo', data);
          this.tempcount++;
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
  deviceInfoMantra() {
    // debugger
    let MethodInfo = '';
    let GetCustomDomName = '127.0.0.1';
    let finalUrl = 'http://' + GetCustomDomName + ':' + $('#rdport').val();
    try {
      let protocol = window.location.href;
      if (protocol.indexOf('https') >= 0) {
        finalUrl = 'https://' + GetCustomDomName + ':' + $('#rdport').val();
      }
    } catch (e) {}
    let res;
    $.support.cors = true;
    let httpStaus = false;
    $.ajax({
      type: 'DEVICEINFO',
      async: false,
      crossDomain: true,
      url: finalUrl + MethodInfo,
      contentType: 'text/xml; charset=utf-8',
      processData: false,
      success: function (data: any) {
        $('#rdInfo').val(data);
        httpStaus = true;
        res = { httpStaus: httpStaus, data: data };
        let xmlstr;
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');
          const serializer = new XMLSerializer();
          xmlstr = serializer.serializeToString(xmlDoc);
        } catch (e) {
          xmlstr = data
            .replace('<?xml version="1.0"?>', '')
            .replace('<?xml version="1.0" encoding="UTF-8"?>', '');
        }

        data = xmlstr;
        let xmlDoc = $.parseXML(data);
        let $xml = $(xmlDoc);
        let deviceName = $xml.find('DeviceInfo').attr('dpId');
        let deviceModel = $xml.find('DeviceInfo').attr('mi');
        let mc = $xml.find('DeviceInfo').attr('mc');
        let additional_info = $xml.find('DeviceInfo').find('additional_info');
        let outerHTML = additional_info[0].outerHTML;
        let deviceSerialNo = $(outerHTML).find('Param').attr('value'); //srno

        let irisObject = {
          deviceName: deviceName,
          deviceSerialNo: deviceSerialNo,
          deviceModel: deviceModel,
        };

        sessionStorage.setItem('irisObject', JSON.stringify(irisObject));
        $('#mi').val(deviceModel);
        $('#mc').val(mc);
        $('#dpid').val(deviceName);
        $('#rdInfo').val(data);
        sessionStorage.setItem('rdInfo', data);
        this.rdInfos = data;
      },
      error: function (jqXHR: any, ajaxOptions: any, thrownError: any) {
        alert(thrownError);
      },
    });
    return res;
  }
  verifyThumb(event: any, authType: any) {
    if (!this.isDeclarationValid) {
      $('#verificationAuthCheckbox').focus();
      this.swalService.infoSWAL(
        'Declaration Required',
        'Please check aadhaar consent!'
      );
      event.target.value = 100;
      return;
    }
    let deviceId = event.target.value;
    this.authType = authType;
    this.verificationMode = 6;
    $('#btnAuthentication').hide();
    if (deviceId === '3') {
      $('#btnFinger').show();
      $('#btnFinger1').hide();
      $('#IRISbtn').click();
      this.discoverMantraDevice();
    } else if (deviceId === '2' || deviceId === '4') {
      this.discoverACPLDevice();
      $('#btnFinger1').show();
      $('#btnFinger').hide();
      $('#IRISbtn').click();
    }

    $('#btnBiomatique').hide();
    $('#btnMantra').hide();
  }
  discoverACPLDevice() {
    // debugger
    let instance = this;
    let status = false;
    var port;
    var urlStr = '';

    for (let i: any = 11100; i <= 11200; i++) {
      urlStr = 'http://localhost:' + i + '/';

      if (status === false) {
        this.getJSON_rd(urlStr, function (err: any, data: any) {
          if (err != null) {
            alert('Something went wrong: ' + err);
          } else {
            let finalUrl = urlStr;
            let $doc = $.parseXML(data);
            let CmbData1 = $($doc).find('RDService').attr('status');
            let CmbData2 = $($doc).find('RDService').attr('info');
            if (
              RegExp('\\b' + 'Access Computech' + '\\b').test(CmbData2) == true
            ) {
              $('#rdStatus').val(CmbData1);
              $('#rdinfo').val(CmbData2);
              $('#rdport').val(i);
              if (CmbData1 == 'READY') {
                sessionStorage.setItem('rdURL', finalUrl);
                $('#btnBiomatique').hide();
                $('#btnFinger').hide();
                $('#btnFinger1').show();
                $('#btnMantra').hide();
                $('#IRISbtn').click();
                $('#rdport').val(i);

                status = true;
                instance.setDeviceInfoACPL();
              } else {
                $('#btnBiomatique').hide();
                $('#btnFinger').hide();
                $('#btnFinger1').hide();
                $('#btnMantra').hide();
              }
              return;
            }
          }
        });
      }
    }
    this.setDeviceInfoACPL();
  }
  getJSON_rd = function (url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.open('RDSERVICE', url, true);
    xhr.responseType = 'text';
    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };
  setDeviceInfoACPL() {
    var port = $('#rdport').val();
    var urlStr = '';
    // debugger;
    urlStr = 'http://localhost:' + port + '/rd/info';
    this.getJSON_info(urlStr, function (err: any, data: any) {
      if (err != null) {
        alert('Something went wrong: ' + err);
      } else {
        $('#rdInfo').val(data);
        let xmlstr;

        try {
          // xmlstr = data.xml ? data.xml : (new XMLSerializer()).serializeToString(data);
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'application/xml');

          // Serialize the DOM Document to a string
          const serializer = new XMLSerializer();
          xmlstr = serializer.serializeToString(xmlDoc);
        } catch (e) {
          xmlstr = data
            .replace('<?xml version="1.0"?>', '')
            .replace('<?xml version="1.0" encoding="UTF-8"?>', '');
        }

        data = xmlstr;
        let xmlDoc = $.parseXML(data);
        let $xml = $(xmlDoc);
        let deviceName = $xml.find('DeviceInfo').attr('dpId');
        let deviceModel = $xml.find('DeviceInfo').attr('mi');
        let mc = $xml.find('DeviceInfo').attr('mc');
        let additional_info = $xml.find('DeviceInfo').find('additional_info');
        let outerHTML = additional_info[0].outerHTML;
        let deviceSerialNo = $(outerHTML).find('Param').attr('value'); //srno

        let irisObject = {
          deviceName: deviceName,
          deviceSerialNo: deviceSerialNo,
          deviceModel: deviceModel,
        };
        // debugger;
        sessionStorage.setItem('irisObject', JSON.stringify(irisObject));
        $('#mi').val(deviceModel);
        $('#mc').val(mc);
        $('#dpid').val(deviceName);
        $('#rdInfo').val(data);
        sessionStorage.setItem('rdInfo', data);
        // this.rdInfos = data;
      }
    });
  }
  getJSON_info = function (url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.open('DEVICEINFO', url, true);
    xhr.responseType = 'text';
    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send();
  };
  fingerDeviceList: any[] = [];
  getFingerDeviceList() {
    let data = {
      verificationMode: 6,
    };
    this.service.getFingerDeviceList(data).subscribe((res: any) => {
      if (res.status === 'success')
        this.fingerDeviceList = res.data.fingerDeviceList;
      else this.fingerDeviceList = [];
    });
  }
  Capture() {
    $('#getrdresponse').html('');
    let val = '';
    if ($('rdProduction').prop('checked', true)) {
      val = $('rdProduction').val();
    }

    let primaryUrl = sessionStorage.getItem('rdURL');
    let urlcapture = primaryUrl + '/BISPL/capture';

    let PIDOPTS =
      '<PidOptions ver="1.0">' +
      '<Opts fCount="0" fType="" iCount="1" iType="0" pCount="" pType="" format="0" pidVer="2.0" timeout="15000" otp="" wadh="" posh="" env="' +
      val +
      '"/>' +
      '</PidOptions>';

    let res;
    let httpStaus = false;
    let xmlstr = '';
    let RDurl = urlcapture;

    $.ajax({
      type: 'CAPTURE',
      async: false,
      crossDomain: true,
      url: RDurl,
      contentType: 'text/xml; charset=utf-8',
      data: PIDOPTS,
      processData: false,
      cache: false,
      success: function (data: any) {
        try {
          xmlstr = data.xml
            ? data.xml
            : new XMLSerializer().serializeToString(data);

          data = xmlstr;
          let xmlDoc = $.parseXML(data);
          let $xml = $(xmlDoc);
          let dpid = $xml.find('DeviceInfo').attr('dpId');
          let mi = $xml.find('DeviceInfo').attr('mi');
          let mc = $xml.find('DeviceInfo').attr('mc');
          let errorcode = $xml.find('Resp').attr('errCode');
          let errInfo = $xml.find('Resp').attr('errInfo');

          $('#mi').val(mi);
          $('#mc').val(mc);
          $('#dpid').val(dpid);
          $('#errCode').val(errorcode);
          $('#errInfo').val(errInfo);
          $('#rdData').val(data);
          if (errInfo == $('#errCode').text()) {
            $('#btnAuthentication').show();
          }

          this.tempcount++;
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
  CaptureAvdm() {
    let strWadh = '';
    let strOtp = '';
    let fcount = 0;
    let fType = 'FMR';
    let Icount = 1;
    let pCount = 0;
    let pgCount = 1;
    let Dtypeformat = 0;
    let Pidver = 1;
    let Timeout = 1000;
    let pTimeout = 2000;
    let MethodCapture = '/rd/capture';
    let Env = 'P';
    let txtCK = '';
    let DemoFinalString = '';
    let GetCustomDomName = '127.0.0.1';
    let XML =
      '<?xml version="1.0"?> <PidOptions ver="1.0"> <Opts fCount="' +
      fcount +
      '" fType="' +
      fType +
      '" iCount="' +
      Icount +
      '" pCount="' +
      pCount +
      '" pgCount="' +
      pgCount +
      '"' +
      strOtp +
      ' format="' +
      Dtypeformat +
      '"   pidVer="' +
      Pidver +
      '" timeout="' +
      Timeout +
      '" pTimeout="' +
      pTimeout +
      '"' +
      strWadh +
      ' posh="UNKNOWN" env="' +
      Env +
      '" /> ' +
      DemoFinalString +
      '<CustOpts><Param name="mantrakey" value="' +
      txtCK +
      '" /></CustOpts> </PidOptions>';
    let finalUrl = 'http://' + GetCustomDomName + ':' + $('#rdport').val();
    try {
      let protocol = window.location.href;
      if (protocol.indexOf('https') >= 0) {
        finalUrl = 'https://' + GetCustomDomName + ':' + $('#rdport').val();
      }
    } catch (e) {}
    let res;
    $.support.cors = true;
    let httpStaus = false;
    $.ajax({
      type: 'CAPTURE',
      async: false,
      crossDomain: true,
      url: finalUrl + MethodCapture,
      data: XML,
      contentType: 'text/xml; charset=utf-8',
      processData: false,
      success: function (data: any) {
        httpStaus = true;
        res = { httpStaus: httpStaus, data: data };
        $('#rdData').val(data);
        let $doc = $.parseXML(data);
        let dpid = $($doc).find('DeviceInfo').attr('dpId');
        let Message = $($doc).find('Resp').attr('errInfo');
        let ErrCode = $($doc).find('Resp').attr('errCode');
        let mc = $($doc).find('DeviceInfo').attr('mc');
        let mi = $($doc).find('DeviceInfo').attr('mi');
        let deviceSlno = $($doc).find('Param').eq(0).attr('value');

        if (Message === 'Capture Failed' || Message === 'Capture timed out') {
          $('#btnAuthentication').hide();
          alert('Something went wrong: ' + Message);
        } else {
          $('#DeviceSlno').val(deviceSlno);
          $('#mi').val(mi);
          $('#mc').val(mc);
          $('#dpid').val(dpid);
          $('#errCode').val(ErrCode);
          $('#errInfo').val(Message);
          if (ErrCode == $('#errCode').val()) {
            $('#btnAuthentication').show();
          }
        }
      },
      error: function (jqXHR: any, ajaxOptions: any, thrownError: any) {
        alert(thrownError);
      },
    });
    return res;
  }
  CaptureFingerAvdm() {
    const MethodCapture = '/rd/capture';
    const GetCustomDomName = '127.0.0.1';
    const rdPort = $('#rdport').val() as string;
    const initialProtocol = window.location.href.includes('https')
      ? 'https'
      : 'http';
    const finalUrl = `${initialProtocol}://${GetCustomDomName}:${rdPort}${MethodCapture}`;

    const XML = `<?xml version="1.0"?>
    <PidOptions ver="1.0">
      <Opts
        fCount="2"
        fType="2"
        iCount="0"
        pCount="0"
        pgCount="2"
        format="0"
        pidVer="2.0"
        timeout="1000"
        pTimeout="2000"
        posh="UNKNOWN"
        env="P"
      />
      <CustOpts>
        <Param name="mantrakey" value="" />
      </CustOpts>
    </PidOptions>`;

    $.support.cors = true;

    return $.ajax({
      type: 'CAPTURE',
      async: false,
      crossDomain: true,
      url: finalUrl,
      data: XML,
      contentType: 'text/xml; charset=utf-8',
      processData: false,
    })
      .then((data: any) => {
        const $doc = $.parseXML(data);
        const Message = $($doc).find('Resp').attr('errInfo');
        const dpid = $($doc).find('DeviceInfo').attr('dpId');
        const ErrCode = $($doc).find('Resp').attr('errCode');
        const mc = $($doc).find('DeviceInfo').attr('mc');
        const deviceSlno = $($doc).find('Param').eq(0).attr('value');
        const mi = $($doc).find('DeviceInfo').attr('mi');

        if (Message === 'Capture Failed' || Message === 'Capture timed out') {
          $('#btnAuthentication').hide();
          alert('Something went wrong: ' + Message);
        } else {
          $('#rdData').val(data);
          $('#DeviceSlno').val(deviceSlno);
          $('#mi').val(mi);
          $('#mc').val(mc);
          $('#dpid').val(dpid);
          $('#errCode').val(ErrCode);
          $('#errInfo').val(Message);
          if (ErrCode == $('#errCode').val()) {
            $('#btnAuthentication').show();
          }
        }
        return { httpStatus: true, data: data };
      })
      .catch((error: any) => {
        console.error('Error during capture:', error);
        return { httpStatus: false, error: error };
      });
  }
  CaptureACPLFingerAvdm() {
    // debugger
    var port = $('#rdport').val();
    var urlStr = '';
    const InputXml: string = `<PidOptions>
      <Opts fCount="2" fType="2" iCount="0" pCount="0" format="0"  iType="0" errCode="0" errInfo=""pidVer="2.0" timeout="20000" otp=""  />
      <Demo></Demo>
      <CustOpts>
        <Param name="ValidationKey" value="" />
      </CustOpts>
     </PidOptions>`;

    urlStr = 'http://localhost:' + port + '/rd/capture';

    this.getJSONCapture(urlStr, function (err: any, data: any) {
      if (err != null) {
        $('#btnAuthentication').hide();
        alert('Something went wrong: ' + err);
      } else {
        const $doc = $.parseXML(data);
        const Message = $($doc).find('Resp').attr('errInfo');
        const dpid = $($doc).find('DeviceInfo').attr('dpId');
        const ErrCode = $($doc).find('Resp').attr('errCode');
        const mc = $($doc).find('DeviceInfo').attr('mc');
        const deviceSlno = $($doc).find('Param').eq(0).attr('value');
        const mi = $($doc).find('DeviceInfo').attr('mi');

        if (Message === 'Capture Failed' || Message === 'Capture timed out') {
          $('#btnAuthentication').hide();
          alert('Something went wrong: ' + Message);
        } else {
          $('#txtPidData').val(data);
          $('#txtPidOptions').val(InputXml);
          $('#rdData').val(data);
          $('#DeviceSlno').val(deviceSlno);
          $('#mi').val(mi);
          $('#mc').val(mc);
          $('#dpid').val(dpid);
          $('#errCode').val(ErrCode);
          $('#errInfo').val(Message);
          $('#btnAuthentication').show();
        }
      }
    });
  }
  irisObject: any;

  IRISVerify(authType: any) {
    this.irisObject = sessionStorage.getItem('irisObject');
    this.irisObject = JSON.parse(this.irisObject);

    let data = {
      rdInfo: sessionStorage.getItem('rdInfo'),
      rdData: $('#rdData').val(),
      userId: this.user?.userId,
      verificationMode: this.verificationMode,
      deviceName: this.irisObject.deviceName,
      deviceSerialNo: this.irisObject.deviceSerialNo,
      deviceModel: this.irisObject.deviceModel,
      authType: this.authType,
      uidRefNumber: this.user?.uidRefNumber,
      aadhaarNumber:
        this.user?.aadhaarNum != null && this.user?.aadhaarNum != undefined
          ? this.user?.aadhaarNum
          : 0,
      groupId: this.user?.groupId,
      fullName: this.user?.fullName,
      urn: '',
      memberId: 0,
      patientMemberId: 0,
      flag:1,
      actionType:this.sharedData.actionType,
      claimId:this.sharedData.claimId,
      claimNo:this.sharedData.claimNo
    };

    this.service
      .verifyIRIS(data)
      .pipe(
        catchError((error: any) => {
          this.swalService.errorSWAL('Error', error);
          throw error;
        })
      )
      .subscribe((data: any) => {
        data = this.encryptionService.getDecryptedData(data);
        if (data.status == 'success') {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Authenticated Successfully',
            text: data.message,
            showConfirmButton: true,
            allowOutsideClick: false,
          }).then(() => {
            // Redirect to dashboard after SweetAlert closes
            this.authType = authType;
            sessionStorage.removeItem('rdInfo');
            sessionStorage.removeItem('irisObject');
            sessionStorage.removeItem('rdURL');
            this.irisFingerClsBtn.nativeElement.click();
            // sessionStorage.setItem('token', this.token);
            // sessionStorage.setItem('user', this.encryptionService.OnEncrypt(JSON.stringify(this.responseData.user)));
            // this.afterSuccessDashBoard();
            this.irisService.onFirstComponentButtonClick(this.sharedData.flag);
          });
        } else {
          this.swalService.errorSWAL('Error', 'Authentication failed');
        }
      });
  }
  getJSONCapture = function (url: any, callback: any) {
    var xhr = new XMLHttpRequest();
    xhr.open('CAPTURE', url, true);
    xhr.responseType = 'text'; //json
    const InputXml: string = `<PidOptions>
      <Opts fCount="2" fType="2" iCount="0" iType="0" pCount="0" errCode="0" errInfo="" format="0" pidVer="2.0" timeout="20000" otp=""  />
      <Demo></Demo>
      <CustOpts>
        <Param name="ValidationKey" value="" />
      </CustOpts>
     </PidOptions>`;

    xhr.onload = function () {
      var status = xhr.status;
      if (status == 200) {
        callback(null, xhr.response);
      } else {
        callback(status);
      }
    };
    xhr.send(InputXml);
  };
}
