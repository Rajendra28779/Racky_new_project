import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HeaderService } from '../../header.service';
import { QcadminServicesService } from '../../Services/qcadmin-services.service';
import { SnocreateserviceService } from '../../Services/snocreateservice.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';

@Component({
  selector: 'app-hospital-civilinfra-add',
  templateUrl: './hospital-civilinfra-add.component.html',
  styleUrls: ['./hospital-civilinfra-add.component.scss']
})
export class HospitalCivilinfraAddComponent implements OnInit {
  @ViewChild('auto') auto;
  @ViewChild('autocopy') autocopy;

  civilInfrastructureForm: any;
  isSubmitHospitalCivilInfrastructureForm: boolean = false;
  buildingAndInfrastructureForm!: FormGroup;
  civilInfraArray: any = [
    { id: 0, name: 'Yes' },
    { id: 1, name: 'No' }
  ];
  showOperationTheatre: boolean = false;
  showBedsInHdu: boolean = false;
  showBedsInopd: boolean = false;
  showLabourRoom: boolean = false;
  showCasuality: boolean = false;
  showNoOfIcu: boolean = false;
  showNoOfIcuwov: boolean = false;
  showNoOfgenaral: boolean = false;
  user: any;
  hospitalId: any;
  hospitalname: any;
  hospitalList: any = [];
  keyword2 = "hospitalName";
  saveorupdate = "SAVE";
  stateList: any = [];
  districtList: any = [];
  data: number = 0;
  showfilter:any=true;
  constructor(private formBuilder: FormBuilder, private snoService: SnocreateserviceService,
    public headerService: HeaderService, public qcadminserv: QcadminServicesService,private route:Router,
    private sessionService: SessionStorageService) {
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.mySubscription = this.route.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
    // Trick the Router into believing it's last link wasn't previously loaded
        this.route.navigated = false;
        }
      });
     }

  ngOnInit(): void {

    this.headerService.setTitle('Hospital Civil Infrastructure Updation');
    this.user = this.sessionService.decryptSessionData("user");
    // this.getStateList();
    // this.getHospitalList();
    if(this.user.groupId==5){
      this.showfilter=false;
      this.getHospitalList();
    }else{
      this.showfilter=true;
      this.getHospitalList();
      this.getStateList();
    }
    this.civilInfrastructureForm = this.formBuilder.group({
      standardisedArchDesign: ['', Validators.required],
      fireFightingSystem: ['', Validators.required],
      bioMedicalWasteManagement: ['', Validators.required],
      dutyStaffRoom: ['', Validators.required],
      cattleTrapAtEntranceAndExit: ['', Validators.required],
      areaBed: ['', Validators.required],
      backUpElectricitySupply: ['', Validators.required],
      noOfFloors: ['', Validators.required],
      liftProvision: ['', Validators.required],
      rampProvision: ['', Validators.required],
      totalBedStrength: ['', Validators.required],
      noOfInPatientBeds: ['', Validators.required],
      fullyEquipiedOperationTheatre: ['', Validators.required],
      totalNoOfBedsFullyEquipedOperationTheatre: ['', Validators.required],
      opd: ['', Validators.required],
      totallNoOfBedopd: ['', Validators.required],
      hdu: ['', Validators.required],
      totallNoOfBedHDU: [''],
      generalWard: ['', Validators.required],
      totalgeneralWard: ['', Validators.required],
      icu: ['', Validators.required],
      totalNoOfBedICU: [''],
      icuwov: ['', Validators.required],
      totalNoOfBedICUwov: [''],
      casualty: ['', Validators.required],
      totalNoOfBedCasualty: [''],
      labourRoom: ['', Validators.required],
      totalNoOfRoomLabourRoom: ['', Validators.required],
      bloodBank: ['', Validators.required],
      cssd: ['', Validators.required],
      dietAndKitchenFacility: ['', Validators.required],
      linenAndLaundry: ['', Validators.required],
      stores: ['', Validators.required],
      medicalRecordsDepartment: ['', Validators.required],
      ambulanceService: ['', Validators.required],
      patientAttendantFacility: ['', Validators.required],
      diagnosticCentreRadiologyBasic: ['', Validators.required],
      diagnosticCentreRadiologyAdvanced: ['', Validators.required],
      diagnosticCentreClinicalLabAndDiagnostics: ['', Validators.required],
      wallsShouldBeCovered: [false],
      availabilityOfSeparateOTs: [false],
      availabilityOfPreOperative: ['', Validators.required],
      availabilityOfPostOperative: ['', Validators.required],
      separateChangingRooms: ['', Validators.required],
      dedicatedScrubArea: ['', Validators.required],
      waitingRoomForPatientsAndRelatives: ['', Validators.required],
      registrationCounter: ['', Validators.required],
      doctorConsultantRooms: ['', Validators.required],
      dressingRoom: ['', Validators.required],
      injectionRoom: ['', Validators.required],
      pharmacyWindow: ['', Validators.required],
      plasterRoom: ['', Validators.required],
      separateStandForStaffPublicVehicles: ['', Validators.required],
      sanitaryFitments: ['', Validators.required],
      hduMultiSignMonitoringSystem: ['', Validators.required],
      hduOxygenSupply: ['', Validators.required],
      hduPipedSuctionAndMedicalGases: ['', Validators.required],
      hduInfusionOfIonotropicSupport: ['', Validators.required],
      hduEquipmentForMaintenanceOfBodyTemperature: ['', Validators.required],
      hduWeighingScale: ['', Validators.required],
      hduManpowerForMonitoring: ['', Validators.required],
      hduEmergencyCashCart: ['', Validators.required],
      hduUninterruptedElectricSupply: ['', Validators.required],
      hduHeating: ['', Validators.required],
      hduAirConditioning: ['', Validators.required],
      hduTotalNoOfBed: ['', Validators.required],
      icuMultiSignMonitoringSystem: ['', Validators.required],
      icuOxygenSupply: ['', Validators.required],
      icuPipedSuctionAndMedicalGases: ['', Validators.required],
      icuInfusionOfIonotropicSupport: ['', Validators.required],
      icuEquipmentForMaintenanceOfBodyTemperature: ['', Validators.required],
      icuWeighingScale: ['', Validators.required],
      icuManpowerForMonitoring: ['', Validators.required],
      icuEmergencyCashCart: ['', Validators.required],
      icuUninterruptedElectricSupply: ['', Validators.required],
      icuHeating: ['', Validators.required],
      icuAirConditioning: ['', Validators.required],
      icuTotalNoOfBed: ['', Validators.required]
    });
  }

  get civilInfrastructureFormControl() {
    return this.civilInfrastructureForm.controls;
  }

  focusFieldOnError(elementName: any) {
    $('#' + elementName).focus();
  }
  buildAndInfraArray = [
    'approvalName',
    'certificateNo',
    'issueDate',
    'expiryDate',
    'actionFile'
  ];

  get buildingAndInfrastructureFormControl() {
    return this.buildingAndInfrastructureForm.controls;
  }

  isNullPresent(value: any) {
    if (value == 0) {
      value = "" + value;
    }
    if (value == "" || value == " " || value == null || value == "null" || value == "NULL" ||
      value == "NULl" || value == undefined || value == "undefined") {
      return true;
    }
    return false;
  }
  totalbedstrenghth: Number = 0;
  totalNoOfBedsFullyEquipedOperationTheatre: Number = 0;
  totallNoOfBedHDU: Number = 0;
  totalgeneralWard: Number = 0;
  totalNoOfBedICU: Number = 0;
  totalNoOfBedICUwov: Number = 0;
  totalNoOfBedCasualty: Number = 0;
  totalNoOfRoomLabourRoom: Number = 0;
  checkFieldValidation(formName: string, event: any, fieldName: string, forWhich: string) {
    let inputValue = event.target.value;
    if (isNaN(inputValue)) {
      return;
    }
    if (inputValue != null && fieldName == 'totalNoOfBedsFullyEquipedOperationTheatre') {
      this.totalNoOfBedsFullyEquipedOperationTheatre = this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totallNoOfBedHDU') {
      this.totallNoOfBedHDU = this.civilInfrastructureFormControl['totallNoOfBedHDU'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totalgeneralWard') {
      this.totalgeneralWard = this.civilInfrastructureFormControl['totalgeneralWard'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totalNoOfBedICU') {
      this.totalNoOfBedICU = this.civilInfrastructureFormControl['totalNoOfBedICU'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totalNoOfBedICUwov') {
      this.totalNoOfBedICUwov = this.civilInfrastructureFormControl['totalNoOfBedICUwov'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totalNoOfBedCasualty') {
      this.totalNoOfBedCasualty = this.civilInfrastructureFormControl['totalNoOfBedCasualty'].value
      this.gettotalbedstength();
    }
    if (inputValue != null && fieldName == 'totalNoOfRoomLabourRoom') {
      this.totalNoOfRoomLabourRoom = this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].value
      this.gettotalbedstength();
    }
    if (this.isNullPresent(inputValue)) {
      $('#' + fieldName).val('');
    }
  }

  gettotalbedstength() {
    this.data = Number(this.totalNoOfBedsFullyEquipedOperationTheatre) + Number(this.totallNoOfBedHDU) + Number(this.totalgeneralWard) + Number(this.totalNoOfBedICU)
      + Number(this.totalNoOfBedICUwov) + Number(this.totalNoOfBedCasualty) + Number(this.totalNoOfRoomLabourRoom);
  }
  dynamicNullUndefinedValidation(formName: any) {
    if (formName == "buildAndInfra") {
      this.buildAndInfraArray.forEach((data: any) => {
        let value = this.buildingAndInfrastructureFormControl[data].value;
        if (this.isNullPresent(value)) {
          this.buildingAndInfrastructureFormControl[data].setValue('');
        }
      });
    }
  }

  dynamicFormValidation(data: any, action: any) {
    if (action == "add") {
      if (data == "fullyEquipiedOperationTheatre") {
        this.civilInfrastructureFormControl['fullyEquipiedOperationTheatre'].setValidators([Validators.required]);
      } else if (data == "totalgeneralWard") {
        this.civilInfrastructureFormControl['totalgeneralWard'].setValidators([Validators.required]);
      } else if (data == "opd") {
        this.civilInfrastructureFormControl['totallNoOfBedopd'].setValidators([Validators.required]);
      } else if (data == "hdu") {
        this.civilInfrastructureFormControl['totallNoOfBedHDU'].setValidators([Validators.required]);
      } else if (data == "icu") {
        this.civilInfrastructureFormControl['totalNoOfBedICU'].setValidators([Validators.required]);
      } else if (data == "icuwov") {
        this.civilInfrastructureFormControl['totalNoOfBedICUwov'].setValidators([Validators.required]);
      } else if (data == "casualty") {
        this.civilInfrastructureFormControl['totalNoOfBedCasualty'].setValidators([Validators.required]);
      } else if (data == "labourRoom") {
        this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].setValidators([Validators.required]);
      }
    } else if (action == "remove") {
      if (data == "fullyEquipiedOperationTheatre") {
        this.civilInfrastructureFormControl['fullyEquipiedOperationTheatre'].clearValidators();
      } else if (data == "totalgeneralWard") {
        this.civilInfrastructureFormControl['totalgeneralWard'].clearValidators();
      } else if (data == "opd") {
        this.civilInfrastructureFormControl['totallNoOfBedopd'].clearValidators();
      } else if (data == "hdu") {
        this.civilInfrastructureFormControl['totallNoOfBedHDU'].clearValidators();
      } else if (data == "icu") {
        this.civilInfrastructureFormControl['totalNoOfBedICU'].clearValidators();
      } else if (data == "icuwov") {
        this.civilInfrastructureFormControl['totalNoOfBedICUwov'].clearValidators();
      } else if (data == "casualty") {
        this.civilInfrastructureFormControl['totalNoOfBedCasualty'].clearValidators();
      } else if (data == "labourRoom") {
        this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].clearValidators();
      }
    }
    this.civilInfrastructureForm.updateValueAndValidity();
  }

  onChangeCivilInfra(loadOrCall: any, val: any, flag: any) {
    let value: any;
    if (loadOrCall == "onCall") {
      value = val.value;
    } else {
      value = val;
    }

    switch (flag) {
      case 'OperationTheatre':
        if (value == '0') {
          this.showOperationTheatre = true;
          this.dynamicFormValidation('fullyEquipiedOperationTheatre', 'add');
        } else if (value == '1') {
          this.showOperationTheatre = false;
          this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('fullyEquipiedOperationTheatre', 'remove');
        }
        break;
      case 'genaralword':
        if (value == '0') {
          this.showNoOfgenaral = true;
          this.dynamicFormValidation('fullyEquipiedOperationTheatre', 'add');
        } else if (value == '1') {
          this.showNoOfgenaral = false;
          this.civilInfrastructureFormControl['totalgeneralWard'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('fullyEquipiedOperationTheatre', 'remove');
        }
        break;

      case 'OPD':
        if (value == '0') {
          this.showBedsInopd = true;
          this.dynamicFormValidation('opd', 'add');
        } else if (value == '1') {
          this.showBedsInopd = false;
          this.dynamicFormValidation('opd', 'remove');
        }
        break;
      case 'HDU':
        if (value == '0') {
          this.showBedsInHdu = true;
          this.dynamicFormValidation('hdu', 'add');
        } else if (value == '1') {
          this.showBedsInHdu = false;
          this.civilInfrastructureFormControl['totallNoOfBedHDU'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('hdu', 'remove');
        }
        break;

      case 'ICU':
        if (value == '0') {
          this.showNoOfIcu = true;
          this.dynamicFormValidation('icu', 'add');
        } else if (value == '1') {
          this.showNoOfIcu = false;
          this.civilInfrastructureFormControl['totalNoOfBedICU'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('icu', 'remove');
        }
        break;
      case 'ICUwov':
        if (value == '0') {
          this.showNoOfIcuwov = true;
          this.dynamicFormValidation('icuwov', 'add');
        } else if (value == '1') {
          this.showNoOfIcuwov = false;
          this.civilInfrastructureFormControl['totalNoOfBedICUwov'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('icuwov', 'remove');
        }
        break;
      case 'Casualty':
        if (value == '0') {
          this.showCasuality = true;
          this.dynamicFormValidation('casualty', 'add');
        } else if (value == '1') {
          this.showCasuality = false;
          this.civilInfrastructureFormControl['totalNoOfBedCasualty'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('casualty', 'remove');
        }
        break;

      case 'LabourRoom':
        if (value == '0') {
          this.showLabourRoom = true;
          this.dynamicFormValidation('labourRoom', 'add');
        } else if (value == '1') {
          this.showLabourRoom = false;
          this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].setValue(0);
          this.civilInfraTotalBedsCount();
          this.dynamicFormValidation('labourRoom', 'remove');
        }
        break;
    }
  }

  civilInfrastructureFormValidation() {
    this.dynamicNullUndefinedValidation("civilInfra");
    if (this.civilInfrastructureFormControl['standardisedArchDesign'].errors) {
      this.focusFieldOnError("standardisedArchDesign");
      return false;
    } else if (this.civilInfrastructureFormControl['fireFightingSystem'].errors) {
      this.focusFieldOnError("fireFightingSystem");
      return false;
    } else if (this.civilInfrastructureFormControl['bioMedicalWasteManagement'].errors) {
      this.focusFieldOnError("bioMedicalWasteManagement");
      return false;
    } else if (this.civilInfrastructureFormControl['dutyStaffRoom'].errors) {
      this.focusFieldOnError("dutyStaffRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['cattleTrapAtEntranceAndExit'].errors) {
      this.focusFieldOnError("cattleTrapAtEntranceAndExit");
      return false;
    } else if (this.civilInfrastructureFormControl['areaBed'].errors) {
      this.focusFieldOnError("areaBed");
      return false;
    } else if (this.civilInfrastructureFormControl['backUpElectricitySupply'].errors) {
      this.focusFieldOnError("backUpElectricitySupply");
      return false;
    } else if (this.civilInfrastructureFormControl['noOfFloors'].errors) {
      this.focusFieldOnError("noOfFloors");
      return false;
    } else if (this.civilInfrastructureFormControl['liftProvision'].errors) {
      this.focusFieldOnError("liftProvision");
      return false;
    } else if (this.civilInfrastructureFormControl['rampProvision'].errors) {
      this.focusFieldOnError("rampProvision");
      return false;
    } else if (this.civilInfrastructureFormControl['totalBedStrength'].errors) {
      this.focusFieldOnError("totalBedStrength");
      return false;
    } else if (this.civilInfrastructureFormControl['noOfInPatientBeds'].errors) {
      this.focusFieldOnError("noOfInPatientBeds");
      return false;
    } else if (this.civilInfrastructureFormControl['fullyEquipiedOperationTheatre'].errors) {
      this.focusFieldOnError("fullyEquipiedOperationTheatre");
      return false;
    } else if (this.showOperationTheatre && this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].errors) {
      this.focusFieldOnError("totalNoOfBedsFullyEquipedOperationTheatre");
      return false;
    } else if (this.civilInfrastructureFormControl['opd'].errors) {
      this.focusFieldOnError("opd");
      return false;
    } else if (this.civilInfrastructureFormControl['hdu'].errors) {
      this.focusFieldOnError("hdu");
      return false;
    } else if (this.showBedsInHdu && this.civilInfrastructureFormControl['totallNoOfBedHDU'].errors) {
      this.focusFieldOnError("totallNoOfBedHDU");
      return false;
    } else if (this.civilInfrastructureFormControl['generalWard'].errors) {
      this.focusFieldOnError("generalWard");
      return false;
    } else if (this.civilInfrastructureFormControl['totalgeneralWard'].errors) {
      this.focusFieldOnError("totalgeneralWard");
      return false;
    } else if (this.civilInfrastructureFormControl['icu'].errors) {
      this.focusFieldOnError("icu");
      return false;
    } else if (this.showNoOfIcu && this.civilInfrastructureFormControl['totalNoOfBedICU'].errors) {
      this.focusFieldOnError("totalNoOfBedICU");
      return false;
    } else if (this.civilInfrastructureFormControl['casualty'].errors) {
      this.focusFieldOnError("casualty");
      return false;
    } else if (this.showCasuality && this.civilInfrastructureFormControl['totalNoOfBedCasualty'].errors) {
      this.focusFieldOnError("totalNoOfBedCasualty");
      return false;
    } else if (this.showLabourRoom && this.civilInfrastructureFormControl['labourRoom'].errors) {
      this.focusFieldOnError("labourRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].errors) {
      this.focusFieldOnError("totalNoOfRoomLabourRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['bloodBank'].errors) {
      this.focusFieldOnError("bloodBank");
      return false;
    } else if (this.civilInfrastructureFormControl['cssd'].errors) {
      this.focusFieldOnError("cssd");
      return false;
    } else if (this.civilInfrastructureFormControl['dietAndKitchenFacility'].errors) {
      this.focusFieldOnError("dietAndKitchenFacility");
      return false;
    } else if (this.civilInfrastructureFormControl['linenAndLaundry'].errors) {
      this.focusFieldOnError("linenAndLaundry");
      return false;
    } else if (this.civilInfrastructureFormControl['stores'].errors) {
      this.focusFieldOnError("stores");
      return false;
    } else if (this.civilInfrastructureFormControl['medicalRecordsDepartment'].errors) {
      this.focusFieldOnError("medicalRecordsDepartment");
      return false;
    } else if (this.civilInfrastructureFormControl['ambulanceService'].errors) {
      this.focusFieldOnError("ambulanceService");
      return false;
    } else if (this.civilInfrastructureFormControl['patientAttendantFacility'].errors) {
      this.focusFieldOnError("patientAttendantFacility");
      return false;
    } else if (this.civilInfrastructureFormControl['diagnosticCentreRadiologyBasic'].errors) {
      this.focusFieldOnError("diagnosticCentreRadiologyBasic");
      return false;
    } else if (this.civilInfrastructureFormControl['diagnosticCentreRadiologyAdvanced'].errors) {
      this.focusFieldOnError("diagnosticCentreRadiologyAdvanced");
      return false;
    } else if (this.civilInfrastructureFormControl['diagnosticCentreClinicalLabAndDiagnostics'].errors) {
      this.focusFieldOnError("diagnosticCentreClinicalLabAndDiagnostics");
      return false;
    } else if (this.civilInfrastructureFormControl['availabilityOfPreOperative'].errors) {
      this.focusFieldOnError("availabilityOfPreOperative");
      return false;
    } else if (this.civilInfrastructureFormControl['availabilityOfPostOperative'].errors) {
      this.focusFieldOnError("availabilityOfPostOperative");
      return false;
    } else if (this.civilInfrastructureFormControl['separateChangingRooms'].errors) {
      this.focusFieldOnError("separateChangingRooms");
      return false;
    } else if (this.civilInfrastructureFormControl['dedicatedScrubArea'].errors) {
      this.focusFieldOnError("dedicatedScrubArea");
      return false;
    } else if (this.civilInfrastructureFormControl['waitingRoomForPatientsAndRelatives'].errors) {
      this.focusFieldOnError("waitingRoomForPatientsAndRelatives");
      return false;
    } else if (this.civilInfrastructureFormControl['registrationCounter'].errors) {
      this.focusFieldOnError("registrationCounter");
      return false;
    } else if (this.civilInfrastructureFormControl['doctorConsultantRooms'].errors) {
      this.focusFieldOnError("doctorConsultantRooms");
      return false;
    } else if (this.civilInfrastructureFormControl['dressingRoom'].errors) {
      this.focusFieldOnError("dressingRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['injectionRoom'].errors) {
      this.focusFieldOnError("injectionRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['pharmacyWindow'].errors) {
      this.focusFieldOnError("pharmacyWindow");
      return false;
    } else if (this.civilInfrastructureFormControl['plasterRoom'].errors) {
      this.focusFieldOnError("plasterRoom");
      return false;
    } else if (this.civilInfrastructureFormControl['separateStandForStaffPublicVehicles'].errors) {
      this.focusFieldOnError("separateStandForStaffPublicVehicles");
      return false;
    } else if (this.civilInfrastructureFormControl['sanitaryFitments'].errors) {
      this.focusFieldOnError("sanitaryFitments");
      return false;
    } else if (this.civilInfrastructureFormControl['hduMultiSignMonitoringSystem'].errors) {
      this.focusFieldOnError("hduMultiSignMonitoringSystem");
      return false;
    } else if (this.civilInfrastructureFormControl['hduOxygenSupply'].errors) {
      this.focusFieldOnError("hduOxygenSupply");
      return false;
    } else if (this.civilInfrastructureFormControl['hduPipedSuctionAndMedicalGases'].errors) {
      this.focusFieldOnError("hduPipedSuctionAndMedicalGases");
      return false;
    } else if (this.civilInfrastructureFormControl['hduInfusionOfIonotropicSupport'].errors) {
      this.focusFieldOnError("hduInfusionOfIonotropicSupport");
      return false;
    } else if (this.civilInfrastructureFormControl['hduEquipmentForMaintenanceOfBodyTemperature'].errors) {
      this.focusFieldOnError("hduEquipmentForMaintenanceOfBodyTemperature");
      return false;
    } else if (this.civilInfrastructureFormControl['hduWeighingScale'].errors) {
      this.focusFieldOnError("hduWeighingScale");
      return false;
    } else if (this.civilInfrastructureFormControl['hduManpowerForMonitoring'].errors) {
      this.focusFieldOnError("hduManpowerForMonitoring");
      return false;
    } else if (this.civilInfrastructureFormControl['hduEmergencyCashCart'].errors) {
      this.focusFieldOnError("hduEmergencyCashCart");
      return false;
    } else if (this.civilInfrastructureFormControl['hduUninterruptedElectricSupply'].errors) {
      this.focusFieldOnError("hduUninterruptedElectricSupply");
      return false;
    } else if (this.civilInfrastructureFormControl['hduHeating'].errors) {
      this.focusFieldOnError("hduHeating");
      return false;
    } else if (this.civilInfrastructureFormControl['hduAirConditioning'].errors) {
      this.focusFieldOnError("hduAirConditioning");
      return false;
    } else if (this.civilInfrastructureFormControl['hduTotalNoOfBed'].errors) {
      this.focusFieldOnError("hduTotalNoOfBed");
      return false;
    } else if (this.civilInfrastructureFormControl['icuMultiSignMonitoringSystem'].errors) {
      this.focusFieldOnError("icuMultiSignMonitoringSystem");
      return false;
    } else if (this.civilInfrastructureFormControl['icuOxygenSupply'].errors) {
      this.focusFieldOnError("icuOxygenSupply");
      return false;
    } else if (this.civilInfrastructureFormControl['icuPipedSuctionAndMedicalGases'].errors) {
      this.focusFieldOnError("icuPipedSuctionAndMedicalGases");
      return false;
    } else if (this.civilInfrastructureFormControl['icuInfusionOfIonotropicSupport'].errors) {
      this.focusFieldOnError("icuInfusionOfIonotropicSupport");
      return false;
    } else if (this.civilInfrastructureFormControl['icuEquipmentForMaintenanceOfBodyTemperature'].errors) {
      this.focusFieldOnError("icuEquipmentForMaintenanceOfBodyTemperature");
      return false;
    } else if (this.civilInfrastructureFormControl['icuWeighingScale'].errors) {
      this.focusFieldOnError("icuWeighingScale");
      return false;
    } else if (this.civilInfrastructureFormControl['icuManpowerForMonitoring'].errors) {
      this.focusFieldOnError("icuManpowerForMonitoring");
      return false;
    } else if (this.civilInfrastructureFormControl['icuEmergencyCashCart'].errors) {
      this.focusFieldOnError("icuEmergencyCashCart");
      return false;
    } else if (this.civilInfrastructureFormControl['icuUninterruptedElectricSupply'].errors) {
      this.focusFieldOnError("icuUninterruptedElectricSupply");
      return false;
    } else if (this.civilInfrastructureFormControl['icuHeating'].errors) {
      this.focusFieldOnError("icuHeating");
      return false;
    } else if (this.civilInfrastructureFormControl['icuAirConditioning'].errors) {
      this.focusFieldOnError("icuAirConditioning");
      return false;
    } else if (this.civilInfrastructureFormControl['icuTotalNoOfBed'].errors) {
      this.focusFieldOnError("icuTotalNoOfBed");
      return false;
    }
    return true;
  }

  swal(title, text, icon) {
    Swal.fire({
      icon: icon,
      title: title,
      text: text
    });
  }

  civilCheckBoxes(flag: any, checkBox: any, value: any) {
    let checked: any;
    if (flag == "onCall") {
      checked = checkBox.target.checked;
    } else {
      checked = checkBox;
    }

    if (checked) {
      if (value == "Walls") {
        this.civilInfrastructureFormControl['wallsShouldBeCovered'].setValue(true);
      } else if (value == "Availability") {
        this.civilInfrastructureFormControl['availabilityOfSeparateOTs'].setValue(true);
      }
    } else {
      if (value == "Walls") {
        this.civilInfrastructureFormControl['wallsShouldBeCovered'].setValue(false);
      } else if (value == "Availability") {
        this.civilInfrastructureFormControl['availabilityOfSeparateOTs'].setValue(false);
      }
    }
  }

  setCivilInfrastructureDetails(data: any) {
    this.civilInfrastructureFormControl['standardisedArchDesign'].setValue(data.ARCH_DESIGN != null ? data.ARCH_DESIGN : "");
    this.civilInfrastructureFormControl['fireFightingSystem'].setValue(data.FIRE_FIGHTING_SYS != null ? data.FIRE_FIGHTING_SYS : "");
    this.civilInfrastructureFormControl['bioMedicalWasteManagement'].setValue(data.BIO_MEDI_WASTE_MGMT != null ? data.BIO_MEDI_WASTE_MGMT : "");
    this.civilInfrastructureFormControl['dutyStaffRoom'].setValue(data.DUTY_STAFF_RM != null ? data.DUTY_STAFF_RM : "");
    this.civilInfrastructureFormControl['cattleTrapAtEntranceAndExit'].setValue(data.CATTLE_ENTR_AND_EXIT != null ? data.CATTLE_ENTR_AND_EXIT : "");
    this.civilInfrastructureFormControl['areaBed'].setValue(data.AREA_BED);
    this.civilInfrastructureFormControl['backUpElectricitySupply'].setValue(data.BACK_UP_ELEC_SUPPLY != null ? data.BACK_UP_ELEC_SUPPLY : "");
    this.civilInfrastructureFormControl['noOfFloors'].setValue(data.NO_OF_FLRS);
    this.civilInfrastructureFormControl['liftProvision'].setValue(data.LIFT_PROV != null ? data.LIFT_PROV : "");
    this.civilInfrastructureFormControl['rampProvision'].setValue(data.RAMP_PROV != null ? data.RAMP_PROV : "");
    this.civilInfrastructureFormControl['totalBedStrength'].setValue(data.TOTAL_BED_STRENGTH);
    this.civilInfrastructureFormControl['noOfInPatientBeds'].setValue(data.NO_OF_INPATIENT_BEDS);
    this.civilInfrastructureFormControl['fullyEquipiedOperationTheatre'].setValue(data.FULLY_EQU_OPRN_THTR != null ? data.FULLY_EQU_OPRN_THTR : "");
    if (data.FULLY_EQU_OPRN_THTR != null) { this.onChangeCivilInfra('onLoad', data.FULLY_EQU_OPRN_THTR, 'OperationTheatre') };
    this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].setValue(data.TOTAL_BEDS_OPRN_THTR);
    this.civilInfrastructureFormControl['opd'].setValue(data.OPD != null ? data.OPD : "");
    this.civilInfrastructureFormControl['hdu'].setValue(data.HDU != null ? data.HDU : "");
    if (data.HDU != null) { this.onChangeCivilInfra('onLoad', data.HDU, 'HDU') };
    this.civilInfrastructureFormControl['totallNoOfBedHDU'].setValue(data.TOTAL_BED_HDU);
    this.civilInfrastructureFormControl['generalWard'].setValue(data.GENERAL_WARD != null ? data.GENERAL_WARD : "");
    if (data.GENERAL_WARD != null) { this.onChangeCivilInfra('onLoad', data.GENERAL_WARD, 'genaralword') };
    this.civilInfrastructureFormControl['totalgeneralWard'].setValue(data.NUMBER_OF_BED_GENERAL_WARD);
    this.civilInfrastructureFormControl['icu'].setValue(data.ICU_WITH_VENTILATOR != null ? data.ICU_WITH_VENTILATOR : "");
    if (data.ICU_WITH_VENTILATOR != null) { this.onChangeCivilInfra('onLoad', data.ICU_WITH_VENTILATOR, 'ICU') };
    this.civilInfrastructureFormControl['totalNoOfBedICU'].setValue(data.NUMBER_OF_BED_ICU_WITH_VENTILATOR);
    this.civilInfrastructureFormControl['icuwov'].setValue(data.ICU_WITHOUT_VENTILATOR != null ? data.ICU_WITHOUT_VENTILATOR : "");
    if (data.ICU_WITHOUT_VENTILATOR != null) { this.onChangeCivilInfra('onLoad', data.ICU_WITHOUT_VENTILATOR, 'ICUwov') };
    this.civilInfrastructureFormControl['totalNoOfBedICUwov'].setValue(data.NUMBER_OF_BED_ICU_WITHOUT_VENTILATOR);
    this.civilInfrastructureFormControl['casualty'].setValue(data.CASUALTY != null ? data.CASUALTY : "");
    if (data.CASUALTY != null) { this.onChangeCivilInfra('onLoad', data.CASUALTY, 'Casualty') };
    this.civilInfrastructureFormControl['totalNoOfBedCasualty'].setValue(data.TOTAL_BED_CASUALTY);
    this.civilInfrastructureFormControl['labourRoom'].setValue(data.LABOUR_ROOM != null ? data.LIFT_PROV : "");
    if (data.LABOUR_ROOM != null) { this.onChangeCivilInfra('onLoad', data.LABOUR_ROOM, 'LabourRoom') };
    this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].setValue(data.TOTAL_BED_IN_LBR_RM);
    this.civilInfrastructureFormControl['bloodBank'].setValue(data.BLOOD_BANK != null ? data.BLOOD_BANK : "");
    this.civilInfrastructureFormControl['cssd'].setValue(data.CSSD != null ? data.CSSD : "");
    this.civilInfrastructureFormControl['dietAndKitchenFacility'].setValue(data.KITCHEN_FACILITY != null ? data.KITCHEN_FACILITY : "");
    this.civilInfrastructureFormControl['linenAndLaundry'].setValue(data.LIEN_AND_LAUNDARY != null ? data.LIEN_AND_LAUNDARY : "");
    this.civilInfrastructureFormControl['stores'].setValue(data.STORES != null ? data.STORES : "");
    this.civilInfrastructureFormControl['medicalRecordsDepartment'].setValue(data.MEDICAL_RECORDS_DEPT != null ? data.MEDICAL_RECORDS_DEPT : "");
    this.civilInfrastructureFormControl['ambulanceService'].setValue(data.AMBULANCE_SERV != null ? data.AMBULANCE_SERV : "");
    this.civilInfrastructureFormControl['patientAttendantFacility'].setValue(data.PATIENT_ATTENDANT_FACILITY != null ? data.PATIENT_ATTENDANT_FACILITY : "");
    this.civilInfrastructureFormControl['diagnosticCentreRadiologyBasic'].setValue(data.DIAG_CENT_RADIOLOGY_BASIC != null ? data.DIAG_CENT_RADIOLOGY_BASIC : "");
    this.civilInfrastructureFormControl['diagnosticCentreRadiologyAdvanced'].setValue(data.DIAG_CENT_RADIOLOGY_ADV != null ? data.DIAG_CENT_RADIOLOGY_ADV : "");
    this.civilInfrastructureFormControl['diagnosticCentreClinicalLabAndDiagnostics'].setValue(data.DIAG_CENT_CLINICAL_LAB_AND_DIAG != null ? data.DIAG_CENT_CLINICAL_LAB_AND_DIAG : "");
    this.civilCheckBoxes('onLoad', (data.WALLS == "0" ? true : false), "Walls");
    this.civilCheckBoxes('onLoad', (data.AVAILABILITY_OF_SPRT_OTS == "0" ? true : false), "Availability");
    this.civilInfrastructureFormControl['availabilityOfPreOperative'].setValue(data.PRE_OPERATIVE_WAITINGRM != null ? data.PRE_OPERATIVE_WAITINGRM : "");
    this.civilInfrastructureFormControl['availabilityOfPostOperative'].setValue(data.POST_OPERATIVE_WARD != null ? data.POST_OPERATIVE_WARD : "");
    this.civilInfrastructureFormControl['separateChangingRooms'].setValue(data.SEPRT_CHANGING_ROOMS != null ? data.SEPRT_CHANGING_ROOMS : "");
    this.civilInfrastructureFormControl['dedicatedScrubArea'].setValue(data.DEDICATED_SCRUB_AREA != null ? data.DEDICATED_SCRUB_AREA : "");
    this.civilInfrastructureFormControl['waitingRoomForPatientsAndRelatives'].setValue(data.WTING_RM_FR_PATIENTS != null ? data.WTING_RM_FR_PATIENTS : "");
    this.civilInfrastructureFormControl['registrationCounter'].setValue(data.REGISTRATION_COUNTER != null ? data.REGISTRATION_COUNTER : "");
    this.civilInfrastructureFormControl['doctorConsultantRooms'].setValue(data.DOCTOR_CONSULTANT_ROOMS != null ? data.DOCTOR_CONSULTANT_ROOMS : "");
    this.civilInfrastructureFormControl['dressingRoom'].setValue(data.DRESSING_ROOM != null ? data.DRESSING_ROOM : "");
    this.civilInfrastructureFormControl['injectionRoom'].setValue(data.INJECTION_ROOM != null ? data.INJECTION_ROOM : "");
    this.civilInfrastructureFormControl['pharmacyWindow'].setValue(data.PHARMACY_WINDOW != null ? data.PHARMACY_WINDOW : "");
    this.civilInfrastructureFormControl['plasterRoom'].setValue(data.PLASTER_ROOM != null ? data.PLASTER_ROOM : "");
    this.civilInfrastructureFormControl['separateStandForStaffPublicVehicles'].setValue(data.STAFF_PUB_VEHICLES != null ? data.STAFF_PUB_VEHICLES : "");
    this.civilInfrastructureFormControl['sanitaryFitments'].setValue(data.SANITARY_FITMENTS != null ? data.SANITARY_FITMENTS : "");
    this.civilInfrastructureFormControl['hduMultiSignMonitoringSystem'].setValue(data.MULTI_SIGN_MONT_SYS_HDU != null ? data.MULTI_SIGN_MONT_SYS_HDU : "");
    this.civilInfrastructureFormControl['hduOxygenSupply'].setValue(data.OXYGEN_SPLY_HDU != null ? data.OXYGEN_SPLY_HDU : "");
    this.civilInfrastructureFormControl['hduPipedSuctionAndMedicalGases'].setValue(data.PIPED_SUCTION_MEDICAL_GASES_HDU != null ? data.PIPED_SUCTION_MEDICAL_GASES_HDU : "");
    this.civilInfrastructureFormControl['hduInfusionOfIonotropicSupport'].setValue(data.INF_OF_IONOTROPIC_SPRT_HDU != null ? data.INF_OF_IONOTROPIC_SPRT_HDU : "");
    this.civilInfrastructureFormControl['hduEquipmentForMaintenanceOfBodyTemperature'].setValue(data.EQU_FR_MTNC_OF_BODY_TEMP_HDU != null ? data.EQU_FR_MTNC_OF_BODY_TEMP_HDU : "");
    this.civilInfrastructureFormControl['hduWeighingScale'].setValue(data.WEIGHING_SCALE_HDU != null ? data.WEIGHING_SCALE_HDU : "");
    this.civilInfrastructureFormControl['hduManpowerForMonitoring'].setValue(data.MANPWR_FR_MONTR_HDU != null ? data.MANPWR_FR_MONTR_HDU : "");
    this.civilInfrastructureFormControl['hduEmergencyCashCart'].setValue(data.EMERG_CASH_CART_HDU != null ? data.EMERG_CASH_CART_HDU : "");
    this.civilInfrastructureFormControl['hduUninterruptedElectricSupply'].setValue(data.UNINTERRUPTED_ELEC_SPLY_HDU != null ? data.UNINTERRUPTED_ELEC_SPLY_HDU : "");
    this.civilInfrastructureFormControl['hduHeating'].setValue(data.HEATING_HDU != null ? data.HEATING_HDU : "");
    this.civilInfrastructureFormControl['hduAirConditioning'].setValue(data.AIR_COND_HDU != null ? data.AIR_COND_HDU : "");
    this.civilInfrastructureFormControl['hduTotalNoOfBed'].setValue(data.NO_OF_BED_HDU);
    this.civilInfrastructureFormControl['icuMultiSignMonitoringSystem'].setValue(data.MULTI_SIGN_MONT_SYS_ICU != null ? data.MULTI_SIGN_MONT_SYS_ICU : "");
    this.civilInfrastructureFormControl['icuOxygenSupply'].setValue(data.OXYGEN_SPLY_ICU != null ? data.OXYGEN_SPLY_ICU : "");
    this.civilInfrastructureFormControl['icuPipedSuctionAndMedicalGases'].setValue(data.PIPED_SUCT_MEDI_GASES_ICU != null ? data.PIPED_SUCT_MEDI_GASES_ICU : "");
    this.civilInfrastructureFormControl['icuInfusionOfIonotropicSupport'].setValue(data.INFUSION_OF_IONOTROPIC_SUP_ICU != null ? data.INFUSION_OF_IONOTROPIC_SUP_ICU : "");
    this.civilInfrastructureFormControl['icuEquipmentForMaintenanceOfBodyTemperature'].setValue(data.EQU_FR_MTNC_OF_BODY_TEMP_ICU != null ? data.EQU_FR_MTNC_OF_BODY_TEMP_ICU : "");
    this.civilInfrastructureFormControl['icuWeighingScale'].setValue(data.WEIGHING_SCALE_ICU != null ? data.WEIGHING_SCALE_ICU : "");
    this.civilInfrastructureFormControl['icuManpowerForMonitoring'].setValue(data.MANPWR_FR_MONT_ICU != null ? data.MANPWR_FR_MONT_ICU : "");
    this.civilInfrastructureFormControl['icuEmergencyCashCart'].setValue(data.EMERG_CASH_CART_ICU != null ? data.EMERG_CASH_CART_ICU : "");
    this.civilInfrastructureFormControl['icuUninterruptedElectricSupply'].setValue(data.UNINTERRUPTED_ELEC_SPLY_ICU != null ? data.UNINTERRUPTED_ELEC_SPLY_ICU : "");
    this.civilInfrastructureFormControl['icuHeating'].setValue(data.HEATING_ICU != null ? data.HEATING_ICU : "");
    this.civilInfrastructureFormControl['icuAirConditioning'].setValue(data.AIR_COND_ICU != null ? data.AIR_COND_ICU : "");
    this.civilInfrastructureFormControl['icuTotalNoOfBed'].setValue(data.NUMBER_OF_BED_ICU);
  }
  submitCivilInfrastructure() {
    if (this.hospitalId == null || this.hospitalId == "" || this.hospitalId == undefined) {
      this.swal("Info", "Please select Hospital Name", 'info');
      return;
    }
    let totalbed = this.civilInfrastructureFormControl['totalBedStrength'].value;
    let patientinbed = this.civilInfrastructureFormControl['noOfInPatientBeds'].value;
    if (totalbed < patientinbed) {
      this.swal("Info", "Number of InPatient Beds Should not Be Greater Then Total Bed Strength", 'info');
      return;
    }
    Swal.fire({
      title: 'Are You Sure?',
      text: "You Want To Save This Data!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Submit It!'
    }).then((result) => {
      if (result.isConfirmed) {
        let data = {
          "hospitalId": this.hospitalId,
          "saveOrUpdate": this.saveorupdate,
          "createdByOrUpdatedBy": this.user.userId,
          "standardisedArchDesign": this.civilInfrastructureFormControl['standardisedArchDesign'].value,
          "fireFightingSystem": this.civilInfrastructureFormControl['fireFightingSystem'].value,
          "bioMedicalWasteManagement": this.civilInfrastructureFormControl['bioMedicalWasteManagement'].value,
          "dutyStaffRoom": this.civilInfrastructureFormControl['dutyStaffRoom'].value,
          "cattleTrapAtEntranceAndExit": this.civilInfrastructureFormControl['cattleTrapAtEntranceAndExit'].value,
          "areaBed": this.civilInfrastructureFormControl['areaBed'].value,
          "backUpElectricitySupply": this.civilInfrastructureFormControl['backUpElectricitySupply'].value,
          "noOfFloors": this.civilInfrastructureFormControl['noOfFloors'].value,
          "liftProvision": this.civilInfrastructureFormControl['liftProvision'].value,
          "rampProvision": this.civilInfrastructureFormControl['rampProvision'].value,
          "totalBedStrength": this.civilInfrastructureFormControl['totalBedStrength'].value,
          "noOfInPatientBeds": this.civilInfrastructureFormControl['noOfInPatientBeds'].value,
          "fullyEquipiedOperationTheatre": this.civilInfrastructureFormControl['fullyEquipiedOperationTheatre'].value,
          "totalNoOfBedsFullyEquipedOperationTheatre": this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].value,
          "opd": this.civilInfrastructureFormControl['opd'].value,
          "totallNoOfBedopd": this.civilInfrastructureFormControl['totallNoOfBedopd'].value,
          "hdu": this.civilInfrastructureFormControl['hdu'].value,
          "totallNoOfBedHDU": this.civilInfrastructureFormControl['totallNoOfBedHDU'].value,
          "generalWard": this.civilInfrastructureFormControl['generalWard'].value,
          "totallNoOfBedgeneralWard": this.civilInfrastructureFormControl['totalgeneralWard'].value,
          "icuwv": this.civilInfrastructureFormControl['icu'].value,
          "totalNoOfBedICUwv": this.civilInfrastructureFormControl['totalNoOfBedICU'].value,
          "icuwov": this.civilInfrastructureFormControl['icuwov'].value,
          "totalNoOfBedICUwov": this.civilInfrastructureFormControl['totalNoOfBedICUwov'].value,
          "casualty": this.civilInfrastructureFormControl['casualty'].value,
          "totalNoOfBedCasualty": this.civilInfrastructureFormControl['totalNoOfBedCasualty'].value,
          "labourRoom": this.civilInfrastructureFormControl['labourRoom'].value,
          "totalNoOfRoomLabourRoom": this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].value,
          "bloodBank": this.civilInfrastructureFormControl['bloodBank'].value,
          "cssd": this.civilInfrastructureFormControl['cssd'].value,
          "dietAndKitchenFacility": this.civilInfrastructureFormControl['dietAndKitchenFacility'].value,
          "linenAndLaundry": this.civilInfrastructureFormControl['linenAndLaundry'].value,
          "stores": this.civilInfrastructureFormControl['stores'].value,
          "medicalRecordsDepartment": this.civilInfrastructureFormControl['medicalRecordsDepartment'].value,
          "ambulanceService": this.civilInfrastructureFormControl['ambulanceService'].value,
          "patientAttendantFacility": this.civilInfrastructureFormControl['patientAttendantFacility'].value,
          "diagnosticCentreRadiologyBasic": this.civilInfrastructureFormControl['diagnosticCentreRadiologyBasic'].value,
          "diagnosticCentreRadiologyAdvanced": this.civilInfrastructureFormControl['diagnosticCentreRadiologyAdvanced'].value,
          "diagnosticCentreClinicalLabAndDiagnosticstr": this.civilInfrastructureFormControl['diagnosticCentreClinicalLabAndDiagnostics'].value,
          "wallsShouldBeCovered": (this.civilInfrastructureFormControl['wallsShouldBeCovered'].value ? "0" : "1"),
          "availabilityOfSeparateOTs": (this.civilInfrastructureFormControl['availabilityOfSeparateOTs'].value ? "0" : "1"),
          "availabilityOfPreOperative": this.civilInfrastructureFormControl['availabilityOfPreOperative'].value,
          "availabilityOfPostOperative": this.civilInfrastructureFormControl['availabilityOfPostOperative'].value,
          "separateChangingRooms": this.civilInfrastructureFormControl['separateChangingRooms'].value,
          "dedicatedScrubArea": this.civilInfrastructureFormControl['dedicatedScrubArea'].value,
          "waitingRoomForPatientsAndRelatives": this.civilInfrastructureFormControl['waitingRoomForPatientsAndRelatives'].value,
          "registrationCounter": this.civilInfrastructureFormControl['registrationCounter'].value,
          "doctorConsultantRooms": this.civilInfrastructureFormControl['doctorConsultantRooms'].value,
          "dressingRoom": this.civilInfrastructureFormControl['dressingRoom'].value,
          "injectionRoom": this.civilInfrastructureFormControl['injectionRoom'].value,
          "pharmacyWindow": this.civilInfrastructureFormControl['pharmacyWindow'].value,
          "plasterRoom": this.civilInfrastructureFormControl['plasterRoom'].value,
          "separateStandForStaffPublicVehicles": this.civilInfrastructureFormControl['separateStandForStaffPublicVehicles'].value,
          "sanitaryFitments": this.civilInfrastructureFormControl['sanitaryFitments'].value,
          "hduMultiSignMonitoringSystem": this.civilInfrastructureFormControl['hduMultiSignMonitoringSystem'].value,
          "hduOxygenSupply": this.civilInfrastructureFormControl['hduOxygenSupply'].value,
          "hduPipedSuctionAndMedicalGases": this.civilInfrastructureFormControl['hduPipedSuctionAndMedicalGases'].value,
          "hduInfusionOfIonotropicSupport": this.civilInfrastructureFormControl['hduInfusionOfIonotropicSupport'].value,
          "hduEquipmentForMaintenanceOfBodyTemperature": this.civilInfrastructureFormControl['hduEquipmentForMaintenanceOfBodyTemperature'].value,
          "hduWeighingScale": this.civilInfrastructureFormControl['hduWeighingScale'].value,
          "hduManpowerForMonitoring": this.civilInfrastructureFormControl['hduManpowerForMonitoring'].value,
          "hduEmergencyCashCart": this.civilInfrastructureFormControl['hduEmergencyCashCart'].value,
          "hduUninterruptedElectricSupply": this.civilInfrastructureFormControl['hduUninterruptedElectricSupply'].value,
          "hduHeating": this.civilInfrastructureFormControl['hduHeating'].value,
          "hduAirConditioning": this.civilInfrastructureFormControl['hduAirConditioning'].value,
          "hduTotalNoOfBed": this.civilInfrastructureFormControl['hduTotalNoOfBed'].value,
          "icuMultiSignMonitoringSystem": this.civilInfrastructureFormControl['icuMultiSignMonitoringSystem'].value,
          "icuOxygenSupply": this.civilInfrastructureFormControl['icuOxygenSupply'].value,
          "icuPipedSuctionAndMedicalGases": this.civilInfrastructureFormControl['icuPipedSuctionAndMedicalGases'].value,
          "icuInfusionOfIonotropicSupport": this.civilInfrastructureFormControl['icuInfusionOfIonotropicSupport'].value,
          "icuEquipmentForMaintenanceOfBodyTemperature": this.civilInfrastructureFormControl['icuEquipmentForMaintenanceOfBodyTemperature'].value,
          "icuWeighingScale": this.civilInfrastructureFormControl['icuWeighingScale'].value,
          "icuManpowerForMonitoring": this.civilInfrastructureFormControl['icuManpowerForMonitoring'].value,
          "icuEmergencyCashCart": this.civilInfrastructureFormControl['icuEmergencyCashCart'].value,
          "icuUninterruptedElectricSupply": this.civilInfrastructureFormControl['icuUninterruptedElectricSupply'].value,
          "icuHeating": this.civilInfrastructureFormControl['icuHeating'].value,
          "icuAirConditioning": this.civilInfrastructureFormControl['icuAirConditioning'].value,
          "icuTotalNoOfBed": this.civilInfrastructureFormControl['icuTotalNoOfBed'].value,
        }
        //savecivilinfraconfig
        this.qcadminserv.savecivilinfraconfig(data).subscribe((data: any) => {
          if (data.status == 200) {
            // this.auto.clear();
            // this.reset();
            // $('#stateId').val('');
            // $('#districtId').val('');
            this.route.navigate(['/application/hospitalciviinfraadd']);
            this.swal("Success", "Record Updated Succefully", 'success');

          } else {
            this.swal("Error", data.message, 'error');
          }
        },
          (error) => console.log(error)
        );
      }
    });
  }
  mySubscription: any;
  ngOnDestroy(){
    if (this.mySubscription) {
     this.mySubscription.unsubscribe();
    }
  }
  getStateList() {
    this.snoService.getStateList().subscribe(
      (response) => {
        this.stateList = response;
      },
      (error) => console.log(error)
    );
  }
  OnChangeState(id) {
    this.snoService.getDistrictListByStateId(id).subscribe(
      (response) => {
        this.districtList = response;
        this.getHospitalList();
      },
      (error) => console.log(error)
    )
  }

  getHospitalList() {
    let state;
    let dist;
    if(!this.showfilter){
      state = "";dist=""
    }else{
      state= $('#stateId').val();
      dist=$('#districtId').val();
    }
    this.qcadminserv.gettmasactivehospitallist(state, dist).subscribe(
      (response) => {
        this.auto.clear();
        this.hospitalList = response;
        if(!this.showfilter){
          for(let i=0;i<this.hospitalList.length;i++){
            if(this.hospitalList[i].hospitalCode==this.user.userName){
              this.hospitalId = this.hospitalList[i].hospitalId;
              this.hospitalname = this.hospitalList[i].hospitalName;
              this.getcivilinfradetails(this.hospitalId);
            }
          }
        }
      },
      (error) => console.log(error)
    )
  }

  selectEvent2(item) {
    this.hospitalId = item.hospitalId;
    this.hospitalname = item.hospitalName;
    this.getcivilinfradetails(item.hospitalId);
  }

  getcivilinfradetails(item: any) {
    this.qcadminserv.getcivilinfradetails(item).subscribe(
      (response: any) => {
        if (response.status == 200) {
          if (response.length > 0) {
            this.setCivilInfrastructureDetails(response.civilInfra[0]);
            this.saveorupdate = "UPDATE"
          } else {
            this.saveorupdate = "SAVE"
          }
        }
      },
      (error) => console.log(error)
    )
  }

  clearEvent2() {
    this.hospitalId = '';
    this.hospitalname = '';
    this.civilInfrastructureFormControl.reset;
  }

  reset() {
    this.civilInfrastructureFormControl.reset;
  }

  checkcount() {
    let ot = this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].value;
    let hdu = this.civilInfrastructureFormControl['totallNoOfBedHDU'].value;
    let general = this.civilInfrastructureFormControl['totalgeneralWard'].value;
    let icuwv = this.civilInfrastructureFormControl['totalNoOfBedICU'].value;
    let icuwov = this.civilInfrastructureFormControl['totalNoOfBedICUwov'].value;
    let casuality = this.civilInfrastructureFormControl['totalNoOfBedCasualty'].value;
    let lebour = this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].value;
    let totalbed = this.civilInfrastructureFormControl['totalBedStrength'].value;
    let count = ot != null ? ot : 0 + hdu != null ? hdu : 0 + general != null ? general : 0 + icuwv != null ? icuwv : 0 + icuwov != null ? icuwov : 0 + casuality != null ? casuality : 0 + lebour != null ? lebour : 0;
    return true;
  }


  civilInfraTotalBedsCount() {
    let noOfInPatientBeds = this.isNullPresent(this.civilInfrastructureFormControl['noOfInPatientBeds'].value) ? 0 : Number(this.civilInfrastructureFormControl['noOfInPatientBeds'].value);
    let totalNoOfBedsFullyEquipedOperationTheatre = this.isNullPresent(this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalNoOfBedsFullyEquipedOperationTheatre'].value);
    let totallNoOfBedHDU = this.isNullPresent(this.civilInfrastructureFormControl['totallNoOfBedHDU'].value) ? 0 : Number(this.civilInfrastructureFormControl['totallNoOfBedHDU'].value);
    let totalNoOfBedInGeneralWard = this.isNullPresent(this.civilInfrastructureFormControl['totalgeneralWard'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalgeneralWard'].value);
    let totalBedsInIcuWithVentilator = this.isNullPresent(this.civilInfrastructureFormControl['totalNoOfBedICU'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalNoOfBedICU'].value);
    let totalBedsInIcuWithoutVentilator = this.isNullPresent(this.civilInfrastructureFormControl['totalNoOfBedICUwov'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalNoOfBedICUwov'].value);
    let totalNoOfBedCasualty = this.isNullPresent(this.civilInfrastructureFormControl['totalNoOfBedCasualty'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalNoOfBedCasualty'].value);
    let totalNoOfRoomLabourRoom = this.isNullPresent(this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].value) ? 0 : Number(this.civilInfrastructureFormControl['totalNoOfRoomLabourRoom'].value);

    let count = totalNoOfBedsFullyEquipedOperationTheatre + totallNoOfBedHDU + totalNoOfBedInGeneralWard
      + totalBedsInIcuWithVentilator + totalBedsInIcuWithoutVentilator + totalNoOfBedCasualty + totalNoOfRoomLabourRoom;

    this.civilInfrastructureFormControl['totalBedStrength'].setValue(count);
  }

}
