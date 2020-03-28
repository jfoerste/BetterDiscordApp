import BDV2 from "./v2";

function devMode() {}

devMode.prototype.enable = function(selectorMode) {
    const self = this;
     this.disable();
     $(document).on("keydown.bdDevmode", function(e) {
         if (e.which === 119 || e.which == 118) {//F8
            console.log("%c[%cDevMode%c] %cBreak/Resume", "color: red;", "color: #303030; font-weight:700;", "color:red;", "");
            debugger; // eslint-disable-line no-debugger
            e.preventDefault();
            e.stopImmediatePropagation();
         }
     });

    if (!selectorMode) return;
     $(document).on("contextmenu.bdDevmode", function(e) {
         self.lastSelector = self.getSelector(e.toElement);

         function attach() {
            let cm = $(".contextMenu-HLZMGh");
            if (cm.length <= 0) {
                cm = $("<div class=\"contextMenu-HLZMGh bd-context-menu\"></div>");
                cm.addClass($(".app, .app-2rEoOp").hasClass("theme-dark") ? "theme-dark" : "theme-light");
                cm.appendTo(".app, .app-2rEoOp");
                cm.css("top", e.clientY);
                cm.css("left", e.clientX);
                $(document).on("click.bdDevModeCtx", () => {
                    cm.remove();
                    $(document).off(".bdDevModeCtx");
                });
                $(document).on("contextmenu.bdDevModeCtx", () => {
                    cm.remove();
                    $(document).off(".bdDevModeCtx");
                });
                $(document).on("keyup.bdDevModeCtx", (e) => {
                    if (e.keyCode === 27) {
                        cm.remove();
                        $(document).off(".bdDevModeCtx");
                    }
                });
            }

            const cmo = $("<div/>", {
                "class": "itemGroup-1tL0uz"
            });
            const cmi = $("<div/>", {
                "class": "item-1Yvehc",
                "click": function() {
                    BDV2.NativeModule.copy(self.lastSelector);
                    cm.hide();
                }
            }).append($("<span/>", {text: "Copy Selector"}));
            cmo.append(cmi);
            cm.append(cmo);
            if (cm.hasClass("undefined")) cm.css("top",  "-=" + cmo.outerHeight());
         }

         setImmediate(attach);

         e.stopPropagation();
     });
 };

devMode.prototype.getRules = function(element, css = element.ownerDocument.styleSheets) {
    //if (window.getMatchedCSSRules) return window.getMatchedCSSRules(element);
    const sheets = [...css].filter(s => !s.href || !s.href.includes("BetterDiscordApp"));
    const rules = sheets.map(s => [...(s.cssRules || [])]).flat();
    const elementRules = rules.filter(r => r && r.selectorText && element.matches(r.selectorText) && r.style.length && r.selectorText.split(", ").length < 8 && !r.selectorText.split(", ").includes("*"));
    return elementRules;
};

devMode.prototype.getSelector = function(element) {
    if (element.id) return `#${element.id}`;
    const rules = this.getRules(element);
    const latestRule = rules[rules.length - 1];
    if (latestRule) return latestRule.selectorText;
    else if (element.classList.length) return `.${Array.from(element.classList).join(".")}`;
    return `.${Array.from(element.parentElement.classList).join(".")}`;
};

 devMode.prototype.disable = function() {
     $(document).off("keydown.bdDevmode");
     $(document).off("contextmenu.bdDevmode");
     $(document).off("contextmenu.bdDevModeCtx");
 };

 export default new devMode();