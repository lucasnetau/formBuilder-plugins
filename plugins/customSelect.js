/**
 * Custom Select Control
 **/

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

            if (this.preview) {
                // When in preview (formBuilder) we may be continuously rebuilt, best to put a placeholder in
                this.config.values = [
                    {
                        "label": "Options will be inserted automatically in formRender",
                        "value": "preview",
                        "selected": false
                    },
                ];
            } else {
                /** Simulate fetch() to retrieve fields from API */
                this.config.values = [
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
                ];
            }

            return super.build();
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('customSelect', controlCustomSelect);

    return controlCustomSelect;
});