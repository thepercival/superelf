# SuperElf

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4203/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

  // wedstrijden-scherm:
  //      je wilt hier de wedstrijdronde van de eerste volgende wedstrijd zien die moet gaan beginnen,
  //          als deze er niet is, de wedstrijdronde van de laatst gespeelde wedstrijd (lastFinishedOrInPorgress)
  // stand & pooluser-scherm:
  //      de wedstrijdronde, met een gespeelde wedstrijd en het hoogste nummer (lastFinishedOrInPorgress)

  // bovenaan het schern [voor][transferperiode i(met acties)][na]
  // chat plaatsing nog onbekend
  // blokjes(speelronden) 2 ervoor, huidig en 1 erna + een blokje "alle"
  // swipen voor vorige of volgende wedstrijdronde

  // lijst met wedstrijdnummer
  // en per wedstrijd het begin tijdstip en de status van de wedstrijd

  // backend juiste nummer ophalen voor juiste scherm
  // backend data ophalen voor lijst van gameRoundNumbers(4 per scherm, dus 4 per keer)
