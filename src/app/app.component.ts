import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslationService } from './modules/i18n';
// language list
import { locale as enLang } from './modules/i18n/vocabs/en';
import { locale as chLang } from './modules/i18n/vocabs/ch';
import { locale as esLang } from './modules/i18n/vocabs/es';
import { locale as jpLang } from './modules/i18n/vocabs/jp';
import { locale as deLang } from './modules/i18n/vocabs/de';
import { locale as frLang } from './modules/i18n/vocabs/fr';
import { ThemeModeService } from './_metronic/partials/layout/theme-mode-switcher/theme-mode.service';
import { PageInfoService, PageLink } from './_metronic/layout';
import { Observable } from 'rxjs';
import { AuthService } from './modules/auth';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line:component-selector
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'body[root]',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  title$: Observable<string>;
  bc$: Observable<Array<PageLink>>;

  constructor(
    private translationService: TranslationService,
    private modeService: ThemeModeService,
    private pageInfo: PageInfoService,
    private auth: AuthService,
    public activatedRoute: ActivatedRoute,
    private router: Router  // Añade el Router al constructor
  ) {
    // register translations
    this.translationService.loadTranslations(
      enLang,
      chLang,
      esLang,
      jpLang,
      deLang,
      frLang
    );

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // Aquí puedes ejecutar la lógica que necesites cuando cambie la ruta
      this.auth.validarToken();
    });
  }

  ngOnInit() {
    this.title$ = this.pageInfo.title.asObservable();
    this.bc$ = this.pageInfo.breadcrumbs.asObservable();

    this.title$.subscribe(title => {
      this.bc$.subscribe(breadcrumbs => {
        const breadcrumbTitles = breadcrumbs.map(bc => bc.title).join(' - ');
        document.title = `Admin | ${breadcrumbTitles} ${title}`;
      });
    });

    this.modeService.init();
  }
}
