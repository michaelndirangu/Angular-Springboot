import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from '../clients.service';
import { Clients } from '../Interfaces/Clients';
import { ManageAccountsComponent } from '../manage-accounts/manage-accounts.component';
import {MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  phonePattern = '(\+254|^){1}[ ]?[7]{1}([0-3]{1}[0-9]{1})[ ]?[0-9]{3}[ ]?[0-9]{3}\z';

  displayedColumns: string[] = ['id','imageUrl', 'name', 'email', 'address', 'phoneno', 'Action'];
  dataSource!:MatTableDataSource<any>;

  clientsForm!: FormGroup | any
  imgfile!: | any
  imgPhotoSrc!: any



  constructor( private fb: FormBuilder, private service: ClientsService, private dialog: MatDialog, private _liveAnnouncer: LiveAnnouncer) { }
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {

    this.clientsForm = this.fb.group({
      name: ['', [Validators.required]],
      registration: ['', [Validators.required]],
      krapin: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['',[Validators.required, Validators.email]],
      phoneno: ['', [Validators.required]],
      businessnature: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: [''],
      //files: ['', [Validators.required]],
      signatories: this.fb.array([this.addSignatoryFormGroup()])
    });
    this.getClients();
  }

  addSignatoryFormGroup(): FormGroup {
    return this.fb.group({
      fullname: ['',[Validators.required]],
      signature: ['',[Validators.required]],
      identityno: ['',[Validators.required]],
      employeeno: ['',[Validators.required]],
      address: ['',[Validators.required]],
      phone: ['',[Validators.required]],
      email: ['',[Validators.required, Validators.email]]
    })
  }

  get signatories(): FormArray {
    return this.clientsForm.get('signatories') as FormArray
  }


  addSignatory(): void {

    (<FormArray>this.clientsForm.get('signatories')).push(this.addSignatoryFormGroup())

  }

  removeSignatory(index: number): void {

    (<FormArray>this.clientsForm.get('signatories')).removeAt(index)

  }

  getClients() {
    this.service.getClients().subscribe({
      next: (result) => {
        this.dataSource= new MatTableDataSource(result)
        this.dataSource.paginator = this.paginator
      },
      error: (err) => {
        alert("An error ocurred!")
      }
      
    })
    }

  onSubmit(): void {

    if (this.clientsForm.valid) {
      this.service.addClient(this.clientsForm.value).subscribe(
        (response: Clients) => {
          alert("Saved!")

          this.clientsForm.reset();
        },
        (err: HttpErrorResponse) => {
          alert(err)
        }
      )
    } 
    //console.log(this.clientsForm.value);
  }

  onPhotoChange(event: any) {
    this.imgfile = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        this.imgPhotoSrc = reader.result; //console this
        const img = this.imgPhotoSrc;
        this.clientsForm.patchValue({
          imageUrl: this.imgPhotoSrc
        });
      }
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog() {
    this.dialog.open(ManageAccountsComponent, {
      height: 'auto',
      width: '50%',
    }).afterClosed().subscribe(value => {
      if (value === 'register') {
        this.getClients();
      }
    })
  }

  editClient(element: any) {
    this.dialog.open(ManageAccountsComponent, {
      data: element
    }).afterClosed().subscribe(value => {
      if (value === 'register') {
        this.getClients();
      }
    })
  }

  deleteClient(id: number): void {
    this.service.deleteClient(id)
      .subscribe(
        (res: void) => {
          alert("Delete Client?")
          // console.log(res);
          window.location.reload();
          this.getClients();
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      )
  }

  get name() {
    return this.clientsForm.get('name');
  }
  get registration() {
    return this.clientsForm.get("registration");
  }
  get krapin() {
    return this.clientsForm.get('krapin');
  }
  get address() {
    return this.clientsForm.get('address');
  }
  get email() {
    return this.clientsForm.get('email');
  }
  get businessnature() {
    return this.clientsForm.get('businessnature');
  }
  get phoneno() {
    return this.clientsForm.get('phoneno');
  }
  get fullname() {
    return this.clientsForm.get('fullname');
  }
  get signature() {
    return this.clientsForm.get('signature');
  }
  get identityno() {
    return this.clientsForm.get('identity_card');
  }
  // get address() {
  //   return this.clientsForm.get('address');
  // }
  get employee_no() {
    return this.clientsForm.get('employee_no');
  }
  // get email() {
  //   return this.clientsForm.get('email');
  // }
  get phone_no() {
    return this.clientsForm.get('phone_no');
  }

}

