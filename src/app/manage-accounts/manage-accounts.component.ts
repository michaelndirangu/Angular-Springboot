import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ClientsService } from '../clients.service';
import { Clients } from '../Interfaces/Clients';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-manage-accounts',
  templateUrl: './manage-accounts.component.html',
  styleUrls: ['./manage-accounts.component.css']
})
export class ManageAccountsComponent implements OnInit {
  phonePattern = '(\+254|^){1}[ ]?[7]{1}([0-3]{1}[0-9]{1})[ ]?[0-9]{3}[ ]?[0-9]{3}\z';

  displayedColumns: string[] = ['id', 'name', 'email', 'address', 'phoneno', 'Action'];
  dataSource!:MatTableDataSource<any>;

  clientsForm!: FormGroup | any
  imgfile!: | any
  imgPhotoSrc!: any



  constructor( private fb: FormBuilder, private service: ClientsService, @Inject(MAT_DIALOG_DATA) public editData: any,
  private dialogRef: MatDialogRef<ManageAccountsComponent>) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  get signatories(): FormArray {
    return this.clientsForm.get('signatories') as FormArray
  }

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
    if(this.editData) {
      this.clientsForm.controls['name'].patchValue(this.editData.name);
      this.clientsForm.controls['registration'].patchValue(this.editData.registration);
      this.clientsForm.controls['krapin'].patchValue(this.editData.krapin);
      this.clientsForm.controls['address'].patchValue(this.editData.address);
      this.clientsForm.controls['email'].patchValue(this.editData.email);
      this.clientsForm.controls['phoneno'].patchValue(this.editData.phoneno);
      this.clientsForm.controls['businessnature'].patchValue(this.editData.businessnature);
      // this.clientsForm.controls['Signatories'].patchValue(this.editData.Signatories);
      // this.clientsForm.controls.signatories.patchValue(this.editData.signatories);
    } else {
      alert('error')
    }
    for(let i = 0; i < this.editData?.signatories.length; i++) {
      this.prefillSignatory(this.editData.signatories[i])
    }
  }

prefillSignatory(e: any): void{
    (<FormArray>this.clientsForm.get('signatories')).push(this.SignatoryFormGroup(e))
  }


  SignatoryFormGroup(e: any): FormGroup {
    return this.fb.group({
      fullname: [e.fullname,[Validators.required]],
      signature: [e.signature,[Validators.required]],
      identityno: [e.identityno,[Validators.required]],
      employeeno: [e.employeeno,[Validators.required]],
      address: [e.address,[Validators.required]],
      phone: [e.phone,[Validators.required]],
      email: [e.email,[Validators.required, Validators.email]]
    })
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
      },
      error: (err) => {
        alert("An error ocurred!")
      }
      
    })
    }

  onSubmit(): void {
    if (!this.editData) {
      if (this.clientsForm.valid) {
        this.service.addClient(this.clientsForm.value).subscribe(
          (response: Clients) => {
            console.log(response)
            alert("Saved!")
            this.clientsForm.reset();
              this.dialogRef.close('register');
              window.location.reload()
          },
          (err: HttpErrorResponse) => {
            alert(err)
          }
        )
      } 
      // console.log(this.clientsForm.value);
    } else {
      this.editClient()
      console.log(this.editData)
    }
    //console.log(this.clientsForm.value)
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

  editClient() {
    this.service.updateClient(this.clientsForm.value, this.editData.id).subscribe(
      (response: Clients) => {
        alert(response)
        this.clientsForm.reset
        this.dialogRef.close('update')
      }
    )
  }

  deleteClient(id: number): void {
    this.service.deleteClient(id)
      .subscribe(
        (res: void) => {
          alert("Delete Client??")
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
