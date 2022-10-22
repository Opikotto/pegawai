import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { EmployeeServices } from '../services/employee.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})

export class LoginComponent implements OnInit  {
  loginForm: FormGroup
  submitted = false;
  error = '';
  constructor(
    private router:Router, private formBuilder : FormBuilder, private http : HttpClient, 
    private route: ActivatedRoute, private employeeService: EmployeeServices
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username:['', Validators.required],
      password:['', Validators.required]
    })
  }
  
  get f(){
    return this.loginForm.controls;
  }
  
  login(){
    if(this.loginForm){
      this.processLogin();
    }
  }
  
  private processLogin(){
    this.http.get<any>("http://localhost:3000/loginAccount").subscribe(res =>{
      const user = res.find((a:any)=>{
        return a.username === this.loginForm.value.username && a.password === this.loginForm.value.password
      });
      if(user){
          Swal.fire({
               position: 'top-end',
               icon: 'success',
               title: 'Login Success !',
               showConfirmButton: false,
               timer: 1500
             }).then(()=> {
               this.loginForm.reset;
               this.router.navigate(["/employeelist"])
             })
      }else{
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'user not found',
          showConfirmButton: false,
          timer: 2500
        })
      }
    }, err =>{
      alert("Something went wrong")
    })
  }

}
