import { Route } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () =>
      import('./pages/materias-page/materias-page.component').then(
        (m) => m.MateriasPageComponent
      ),
  },
  {
    path: 'materias',
    loadComponent: () =>
      import('./pages/materias-page/materias-page.component').then(
        (m) => m.MateriasPageComponent
      ),
  },
  {
    path: 'horarios',
    loadComponent: () =>
      import('./pages/horarios-page/horarios-page.component').then(
        (m) => m.HorariosPageComponent
      ),
  },
  {
    path: 'profesores',
    loadComponent: () =>
      import('./pages/profesores-page/profesores-page.component').then(
        (m) => m.ProfesoresPageComponent
      ),
  },
  {
    path: 'aulas',
    loadComponent: () =>
      import('./pages/aulas-page/aulas-page.component').then(
        (m) => m.AulasPageComponent
      ),
  },
  {
    path: 'estudiantes',
    loadComponent: () =>
      import('./pages/estudiantes-page/estudiantes-page.component').then(
        (m) => m.EstudiantesPageComponent
      ),
  },
] satisfies Route[];
