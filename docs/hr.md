# Horizontal Rule

The horizontal rule element `<hr>` can be created using field/template or using a custom control.

## Field / Template definition

```javascript
const opts = {
    fields: [
        {
            label: 'Horizontal Rule',
            type: 'hr',
            icon: '━',
        },
    ],
    templates: {
        hr : function(fieldData) {
            return {
                field: this.markup('hr', null, this.config),
                layout: 'noLabel',
            };
        },
    } 
}
```

### Custom Control definition

[Download Horizontal Rule](../plugins/hr.js)

```javascript
if (!window.fbControls) { window.fbControls = []; }
window.fbControls.push(function(controlClass) {
    "use strict";

    class controlHr extends controlClass {
        static get definition() {
            return {
                icon: "━",
                i18n: {
                    default: 'Horizontal Rule',
                },
            };
        }

        /**
         * Build the HR element
         * @return {HTMLElement|HTMLElement[]|Object} DOM Element to be injected into the form.
         */
        build() {
            this.dom = this.markup('hr', null, this.config);
            return {
                field: this.dom,
                layout: 'noLabel',
            };
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('hr', controlHr);
});
```