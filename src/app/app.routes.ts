import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./core/components/login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'sign-up',
        loadComponent: () => import('./core/components/sign-up/sign-up.component').then(m => m.SignUpComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
        loadChildren: () => import('./features/dashboard/dashboard.routes')
    },
    {
        path: 'students-dashboard',
        loadComponent: () => import('./features/students/pages/student-page/student-page.component').then(m => m.StudentPageComponent),
        loadChildren: () => import('./features/students/students.routes')
    },
];
