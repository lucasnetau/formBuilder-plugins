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