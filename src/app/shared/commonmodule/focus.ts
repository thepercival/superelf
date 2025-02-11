import { OnInit, ElementRef, Directive, input } from '@angular/core';

@Directive({ selector: '[focuMe]' })
export class FocusDirective implements OnInit {

    readonly isFocused = input<boolean>(false, { alias: "focuMe" });

    constructor(private hostElement: ElementRef) { }

    ngOnInit() {
        if (this.isFocused()) {
            this.hostElement.nativeElement.focus();
        }
    }
}