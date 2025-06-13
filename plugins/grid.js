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

    class controlGrid extends controlClass {
        static get definition() {
            return {
                icon: "⊞",
                i18n: {
                    default: 'Grid',
                },
                disabledAttrs: [
                    'value',
                    'access',
                ],
                defaultAttrs: {
                    grid: {
                        type: 'select',
                        label: 'Grid Type',
                        options: {
                            'single-grid': 'Single Select : Whole grid',
                            'multi-grid': 'Multiple Select : Whole grid',
                            'single-row': 'Single Select : Per Row',
                        }
                    },
                    columns: {
                        label: 'Columns',
                        type: 'options',
                        values: [
                            {
                                "label": "Column 1",
                                "value": "col1",
                                "selected": false
                            },
                            {
                                "label": "Column 2",
                                "value": "col2",
                                "selected": false
                            },
                            {
                                "label": "Column 3",
                                "value": "col3",
                                "selected": false
                            }
                        ],
                        noSelect: true,
                    },
                    rows: {
                        label: 'Rows',
                        type: 'options',
                        values: [
                            {
                                "label": "Row 1",
                                "value": "row1",
                                "selected": false
                            },
                            {
                                "label": "Row 2",
                                "value": "row2",
                                "selected": false
                            },
                            {
                                "label": "Row 3",
                                "value": "row3",
                                "selected": false
                            }
                        ],
                        noSelect: true,
                    },
                },
            };
        }

        /**
         * build a text DOM element
         * @return {Object} DOM Element to be injected into the form.
         */
        build() {
            let {rows, columns, value = '', name, grid, ...attrs} = this.config

            const inputTypeMap = {
                'single-grid': 'radio',
                'multi-grid': 'checkbox',
                'single-row': 'radio',
            }

            const inputType = inputTypeMap[grid];

            let items = [];

            rows.forEach((row, rowIndex) => {
                items.push(this.markup('div', row.label, {style: `grid-column: 1; grid-row: ${rowIndex + 2}; overflow-wrap: break-word; white-space: nowrap;`}));
            })
            columns.forEach((col, colIndex) => {
                items.push(this.markup('div', col.label, {style: `grid-column: ${colIndex + 2}; grid-row: 1; overflow-wrap: break-word;`}));
                rows.forEach((row, rowIndex) => {
                    let inputName = name;
                    if (['single-row','multi-grid'].includes(grid)) {
                        inputName = name + '[' + rowIndex + ']';
                    }
                    const input = this.markup('input', null, {
                        name: inputName,
                        value: `${row.value}-${col.value}`,
                        type: inputType
                    })
                    items.push(this.markup('div', input, {style: `grid-column: ${colIndex + 2}; grid-row: ${rowIndex + 2}`}));
                });
            })


            this.dom = this.markup('div', items, this.attrs);

            const $dom = $(this.dom);
            $dom.css('display', 'grid');
            $dom.css('grid-template-columns', `min-content repeat(${columns.length}, 1fr)`);
            $dom.css('grid-template-rows', `repeat(${rows.length + 1}, 1fr)`);
            $dom.css('column-gap', '10px');
            $dom.css('row-gap', '10px');
            $dom.css('width', 'fit-content');

            return {
                field: this.dom,
               // layout: 'hidden',
            };
        }

        /**
         * Load the select values from an API in the onRender() method
         */
        onRender() {
            const controlSelf = this;

            if (controlSelf.preview) {
                return; // When in preview (formBuilder) we may be continuously rebuilt, best to leave a placeholder in
            }

            /** Load user data */
            if (controlSelf.config.userData) {
                $(controlSelf.dom).find('input').val(controlSelf.config.userData);
            }
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('grid', controlGrid);
});