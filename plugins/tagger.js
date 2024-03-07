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

    class controlTagger extends controlClass {
        static get definition() {
            return {
                icon: "🏷️",
                i18n: {
                    default: 'Tags',
                },
                defaultAttrs: {
                    'wrap': {
                        'label': 'wrap',
                        value: false,
                        type: 'checkbox',
                    },
                    'allow_duplicates': {
                        'label': 'allow duplicates',
                        value: false,
                        type: 'checkbox',
                    },
                    'allow_spaces': {
                        'label': 'allow spaces',
                        value: true,
                        type: 'checkbox',
                    },
                    'add_on_blur': {
                        'label': 'Add on Blur',
                        value: false,
                        type: 'checkbox',
                    },
                    'tag_limit': {
                        'label': 'Tag Limit',
                        value: -1,
                        type: 'number',
                    },
                }
            };
        }

        configure() {
            this.js = 'https://cdn.jsdelivr.net/gh/jcubic/tagger/tagger.js';
            this.css = 'https://cdn.jsdelivr.net/gh/jcubic/tagger/tagger.css';
        }

        /**
         * Build the HR element
         * @return {HTMLElement|HTMLElement[]|Object} DOM Element to be injected into the form.
         */
        build() {
            const { name, wrap, allow_duplicates, allow_spaces, add_on_blur, tag_limit, link, ...config } = this.config;
            this.input = this.markup('input', null, config);
            this.container = this.markup('div', this.input);
            return this.container
        }

        onRender() {
            const controlSelf = this;

            /** Setup change handler */
            const name =  controlSelf.config.name + '[]';

            $(controlSelf.input).on('input', function() {
                $(`input[name="${name}"]`, controlSelf.container).remove();
                const tags = controlSelf.input.value.split(/\s*,\s*/).filter(Boolean);
                tags.forEach(function(value) {
                    const tag = controlSelf.markup('input', null, {type: 'hidden', name: name, value: value});
                    $(controlSelf.container).append(tag);
                });
                if (controlSelf.preview) {
                    $(controlSelf.input).trigger('change');
                }
            });

            /** Initialise **/
            let { wrap, allow_duplicates, allow_spaces, add_on_blur, tag_limit, ...other } = this.config;
            tag_limit = (typeof tag_limit === 'number') ? tag_limit : -1;
            if (controlSelf.config.userData) {
                $(controlSelf.input.value = '');
            }
            const taggerInstance = tagger(controlSelf.input, { wrap, allow_duplicates, allow_spaces, add_on_blur, tag_limit, });

            /** Load user data */
            if (controlSelf.config.userData) {
                controlSelf.config.userData.forEach(function(value) {
                    taggerInstance.add_tag(value);
                });
            }

            /** Trigger the input handler to ensure hidden inputs are created to track state */
            $(controlSelf.input).trigger('input');
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('tagger', controlTagger);
});