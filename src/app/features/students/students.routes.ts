import { Route } from "@angular/router";


export default [
    {
        path: '',
        loadComponent: () =>
            import('./pages/student-page/student-page.component').then(
                (m) => m.StudentPageComponent
            ),
    },
    {
        path: 'register-course',
        loadComponent: () =>
            import('./pages/register-courses/register-courses.component').then(
                (m) => m.RegisterCoursesComponent
            ),
    }
] satisfies Route[];