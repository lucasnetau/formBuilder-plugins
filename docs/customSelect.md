# Data bound custom select control

Add a select box to a form that is dynamically configured by a Promise based data lookup

## Custom control setup

[Download Data bound custom select](../plugins/customSelect.js)

Provide a callback which returns a Promise for the customSelect in the controlConfig option. 

```js
const config = {
    formData: [
        {
            "type": "customSelect",
            "required": true,
            "label": "Example Custom Select",
            "className": "form-control",
            "name": "customSelect-1698227152568-1",
            "placeholder": "Select an option...",
        },
    ], 
    controlConfig: {
        customSelect: {
            provider: config => {
                return new Promise((resolve, reject) => {
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
                })
            }
        }
    }
}
```

## Using subtypes to create multiple customSelects with different data providers

Additional data bound select can be configured by creating custom fields and providing a data provider for that subtype

```js
const config = {
    fields: [
        {
            label: "Staff Lookup",
            type: "customSelect",
            subtype: "staffSelect",
            icon: "🧑"
        }
    ],
    formData: [
        {
            "type": "customSelect",
            "subtype": "staffSelect",
            "required": true,
            "label": "Employee",
            "className": "form-control",
            "name": "customSelect-1698227152569-1",
            "placeholder": 'Select staff member...',
        },
    ], 
    controlConfig: {
        'customSelect.staffSelect': {
            provider: config => {
                return new Promise((resolve, reject) => {
                    resolve({
                        options: [
                            {
                                "label": "John Doe",
                                "value": "123",
                                "selected": false
                            },
                            {
                                "label": "Jane Doe",
                                "value": "124",
                                "selected": false
                            },
                        ]
                    })
                })
            }
        }
    }
}
```