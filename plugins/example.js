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
window.fbControls.push(function(controlClass, allControlClasses) {
    "use strict";

    class controlExample extends controlClass {
        static get definition() {
            return {
                icon: "?",
                i18n: {
                    default: 'Example',
                },
                defaultAttrs: {}
            };
        }

        /**
         * Define any Javascript or CSS to load
         */
        configure() {
            /* Uncomment to load Javascript */
            //this.js = '';
            /* Uncomment to load Stylesheet */
            //this.css = '';
        }

        /**
         * Build the element
         * @return {HTMLElement|HTMLElement[]|Object} DOM Element to be injected into the form.
         */
        build() {
            /* Keep a record of the control we create */
            this.field = this.markup('input', null, this.config);
            return this.field
        }

        /**
         * onRender callback
         */
        onRender() {
            /* Load userData, init Javascript etc */
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('example', controlExample);
});