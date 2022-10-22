import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeServices } from '../services/employee.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.less']
})

export class DetailComponent implements OnInit {
detailEmployee:any
constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeServices) { }


  ngOnInit(): void {
     this.getEmployeeId(this.route.snapshot.paramMap.get('id'));
  }

  getEmployeeId(id: string | null): void {
     this.employeeService.getItem(id)
       .subscribe(
         (employee: null) => {
           this.detailEmployee = employee;
         },
         (error: any) => {
           console.log(error);
         });
   }
}
