"use strict";
/**
 * This file is part of the formBuilder plugins repository.
 * https://github.com/lucasnetau/formBuilder-plugins
 *
 * (c) James Lucas <james@lucas.net.au>
 *
 * @license MIT
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
if (!window.fbControls) { window.fbControls = []; }
window.fbControls.push(function(controlClass) {
    "use strict";

    class controlSection extends controlClass {
        static get definition() {
            return {
                icon: "📦",
                i18n: {
                    default: 'Section',
                },
                disabledAttrs: [
                    'value',
                ]
            };
        }

        /**
         * Build the section element
         * @return {HTMLElement|HTMLElement[]|object} DOM Element to be injected into the form.
         */
        build() {
            //Use an HR element so in the odd case that the fields are not wrapped by the fieldset we still have a visible section break
            this.dom = this.markup('hr', null, {className: 'fb-section-marker'});
            return {
                field: this.dom,
                layout: 'hidden',
            };
        }

        onRender() {
            //Rendering in preview mode is not supported
            if (!this.preview) {
                const fieldSet = this.markup('fieldset', null, this.config);
                //Ugly, need to reverse the order of fields in prevUntil otherwise they are wrapped in reverse order
                $(Array.prototype.slice.call($(this.dom).prevUntil('fieldset, .fb-section-marker')).reverse()).wrapAll(fieldSet).parent().prepend(this.markup('legend', this.label, []))
                this.dom.remove()
            }
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('section', controlSection);
});