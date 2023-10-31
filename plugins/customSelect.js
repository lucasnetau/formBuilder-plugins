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

    const controlSelect = allControlClasses.select;
    /**
     * controlCustomSelect class
     */
    class controlCustomSelect extends controlSelect {

        /**
         * Class configuration - return the icons & label related to this control
         * @return definition object
         */
        static get definition() {
            return {
                icon: '✅',
                i18n: {
                    default: 'Dynamic Select',
                },
            };
        }

        /**
         * javascript & css to load
         */
        configure() {

        }

        /**
         *
         * @return {*|HTMLElement|HTMLElement[]|Object}
         */
        build() {
            this.config.type = 'select'; //Required for the parent class to render correctly

            this.config.values = [
                {
                    "label": "Options will be inserted automatically in formRender",
                    "value": "preview",
                    "selected": false
                },
            ];

            return super.build();
        }

        /**
         * Load the select values from an API in the onRender() method
         */
        onRender() {
            if (this.preview) {
                return; // When in preview (formBuilder) we may be continuously rebuilt, best to leave a placeholder in
            }

            const _this = this;
            const placeholder = $('option[value="preview"]', this.dom)[0];
            this.dom.removeChild(placeholder);
            const idTemplate = placeholder.id.slice(0, -1);

            /** Simulate fetch() to retrieve fields from API */
            new Promise((resolve, reject) => {
                resolve({
                    options: [
                        {
                            "label": "Sun",
                            "value": "sun",
                            "selected": false
                        },
                        {
                            "label": "Moon",
                            "value": "moon",
                            "selected": false
                        },
                    ]
                })
            }).then(res => {
                res.options.forEach((option, index) => {
                    const newOpt = placeholder.cloneNode();
                    Object.assign(newOpt, {
                        id: `${idTemplate}${index}`,
                        value: option.value,
                        checked: option.selected,
                        textContent: option.label
                    });
                    this.dom.appendChild(newOpt)
                });
            });
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('customSelect', controlCustomSelect);

    return controlCustomSelect;
});