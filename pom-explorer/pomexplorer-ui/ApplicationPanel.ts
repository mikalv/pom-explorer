import { MaterialDomlet } from "./MaterialDomlet";
import { buildHtmlElement } from "./Utils";

import { TardigradeEngine } from "./node_modules/tardigrade/target/engine/engine";
import { createElement, domChain, indexOf } from "./node_modules/tardigrade/target/engine/runtime";

TardigradeEngine.addTemplate("Application", `
<div class="mdl-layout mdl-js-layout mdl-layout--fixed-header">
    <header class="mdl-layout__header">
        <div class="mdl-layout__header-row">
            <span class="mdl-layout-title">Pom Explorer</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="mdl-badge" data-badge="!">beta</span>
        </div>
    </header>
    <div x-id="Drawer" class="mdl-layout__drawer">
        <span class="mdl-layout-title">Pom Explorer</span>
        <nav x-id="Menu" class="mdl-navigation">
        </nav>
    </div>
    <main x-id="Content" class="mdl-layout__content content-repositionning">
    </main>
</div>
`);

declare var componentHandler: any;

function initMaterialElement(e: HTMLElement) {
    if (e == null)
        return;

    var upgrade = false;
    for (var i = 0; i < e.classList.length; i++)
        if (e.classList[i].indexOf("mdl-") >= 0) {
            upgrade = true;
            break;
        }

    if (upgrade)
        componentHandler.upgradeElement(e);

    for (var c in e.children) {
        if (e.children[c] instanceof HTMLElement)
            initMaterialElement(<HTMLElement>e.children[c]);
    }
}

function getComingChild(p: HTMLElement, element: HTMLElement, domletElement: HTMLElement) {
    var directChild = element;
    while (directChild != null && directChild.parentElement !== p) {
        if (directChild === domletElement)
            return null;
        directChild = directChild.parentElement;
    }
    return directChild;
}

export class ApplicationPanel {
    element: HTMLElement;

    constructor() {
        this.element = createElement(TardigradeEngine.buildHtml("Application", {}));
        initMaterialElement(this.element);
    }

    addMenuHandler(handler: { (index: number, menuItem: HTMLElement, event: any): void; }) {
        var menu = TardigradeEngine.getPoint(this.element, "Application", { "Menu": 0 });
        menu.addEventListener("click", (e) => {
            var target = <HTMLElement>e.target;
            var comingMenuItem = getComingChild(menu, target, this.element);
            var index = indexOf(menu, comingMenuItem);

            handler(index, comingMenuItem, e);

            this.hideDrawer();
        });
    }

    addMenuItem(name: string) {
        var menu = TardigradeEngine.getPoint(this.element, "Application", { "Menu": 0 });
        menu.appendChild(buildHtmlElement(`<a class="mdl-navigation__link" href="#">${name}</a>`));
    }

    main(): HTMLDivElement {
        return <HTMLDivElement>this.element;
    }

    content(): HTMLDivElement {
        return <HTMLDivElement>TardigradeEngine.getPoint(this.element, "Application", { "Content": 0 });
    }

    protected hideDrawer() {
        // fix : the obfuscator is still visible if only remove is-visible from the drawer
        document.getElementsByClassName("mdl-layout__obfuscator")[0].classList.remove("is-visible");
        TardigradeEngine.getPoint(this.element, "Application", { "Drawer": 0 }).classList.remove("is-visible");
    }
}