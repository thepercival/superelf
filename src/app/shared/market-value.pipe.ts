import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "marketValueConverter",
})
export class MarketValuePipe implements PipeTransform {
  transform(value: number): string {
    const millions = value / 1_000_000;
    return `${millions.toFixed(1)}M`;
  }
}
// <span class="small ms-1" [innerHTML]="structureNameService.getRoundName(poolPoule.getRound(), true) | keepHtml"></span>

// import { Pipe, PipeTransform } from "@angular/core";
// import { DomSanitizer } from "@angular/platform-browser";

// @Pipe({ name: "keepHtml", pure: false })
// export class EscapeHtmlPipe implements PipeTransform {
//   constructor(private sanitizer: DomSanitizer) {}

//   transform(content: string) {
//     return this.sanitizer.bypassSecurityTrustHtml(content);
//   }
// }