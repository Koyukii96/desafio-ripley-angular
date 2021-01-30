import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private subscripcion: Subscription = new Subscription;

  loginForm = this.fb.group({
    username: [''],
    password: [''],
  });

  constructor(
    private authSvc:AuthService, 
    private fb: FormBuilder,
    private router: Router
    ) { }

  ngOnInit(): void {
    const userData = {
      username: "UsuarioUser",
      password: "123456",
    };
    this.authSvc.login(userData).subscribe((res)=> console.log("LOGIN"));
  }
  ngOnDestroy(): void{
    this.subscripcion.unsubscribe();
  }
  onLogin():void{
    const formValue = this.loginForm.value;
    this.subscripcion.add(
      this.authSvc.login(formValue).subscribe( res => {
        if(res){
          this.router.navigate(['']);
        }
      })
    );
    
  }
}
