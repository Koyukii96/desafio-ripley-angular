import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckloginGuard } from '@shared/guards/checklogin.guard';

const routes: Routes = [
  { path: '', loadChildren: () => 
    import('./pages/home/home.module').then(m => m.HomeModule) 
  }, 

  { path: 'notFound', loadChildren: () => 
    import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) 
  }, 

  { path: 'admin', loadChildren: () => 
    import('./pages/admin/admin.module').then(m => m.AdminModule) 
  }, 

  { path: 'login', loadChildren: () => 
    import('./pages/auth/login/login.module').then(m => m.LoginModule),
    canActivate: [CheckloginGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
