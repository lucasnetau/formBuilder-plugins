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

    class controlPhotoUpload extends controlClass {
        static get definition() {
            return {
                icon: "📁",
                i18n: {
                    default: 'Photo Upload',
                },
                defaultAttrs: {
                    'multiple': {
                        'label': 'Multiple Files',
                        value: false,
                        type: 'checkbox',
                    },
                }
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
            this.classConfig.uploadType ??= 'multipart';
            this.classConfig.resizeImages ??= false;
            this.classConfig.resizeMaxDimension ??= 1024;
        }

        /**
         * Build the element
         * @return {HTMLElement|HTMLElement[]|Object} DOM Element to be injected into the form.
         */
        build() {
            /* Keep a record of the control we create */
            const config = Object.assign({}, this.config, {name: '', type: 'file', accept: 'image/*', capture:'environment'});
            this.field = this.markup('input', null, config);
            const preview = this.markup('div', this.markup('ol'), {className: 'fb-upload-preview'});
            this.dom = this.markup('div', [this.field, preview], {});
            return this.dom;
        }

        /**
         * onRender callback
         */
        onRender() {
            this.uploadCounter = 0;

            const input = $(this.field);
            input.on('change', this.handleFileSelection.bind(this));

            const dropContainer = $(this.field).closest('.form-group').find('label');

            // dragover and dragenter events need to have 'preventDefault' called
            // in order for the 'drop' event to register.
            // See: https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Drag_operations#droptargets
            dropContainer.on('drag dragstart dragend dragover dragenter dragleave drop', function(evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }).on('dragover dragenter', function() {
                dropContainer.toggleClass('is-dragover', true);
            }).on('dragleave dragend drop', function() {
                dropContainer.toggleClass('is-dragover', false);
            }).on('drop', function(evt) {
                // pretty simple -- but not for IE :(
                this.field.files = evt.originalEvent.dataTransfer.files;
                $(this.field).trigger('change');
            }.bind(this));
            /* Load userData, init Javascript etc */
        }

        humanReadableFileSize(number) {
            if(number < 1024) {
                return number + 'bytes';
            } else if(number > 1024 && number < 1048576) {
                return (number/1024).toFixed(1) + 'KB';
            } else if(number > 1048576) {
                return (number/1048576).toFixed(1) + 'MB';
            }
        }

        async handleFileSelection(event) {
            const self = this;
            const input = event.target;
            if (input.files) {
                Array.from(input.files).forEach(file => {
                    const uploadCount = this.uploadCounter++;
                    const uploadPlaceholder = $('<li>', {class: `upload-temp-${uploadCount}`}).append($('<p>').text(`${file.name} Loading...`));

                    const showUploadPreview = function(src, filename, size, type) {
                        let preview = '';
                        if (src) {
                            preview = $('<img>', {
                                src: src,
                                class: 'img-thumbnail float-left',
                                style: 'max-width: 100px',
                            })[0];
                        }
                        const label = $('<p>').append(
                            $('<span>', {class: 'text-nowrap'}).text(`Filename: ${filename} `),
                            $('<wbr>'),
                            $('<span>', {class: 'text-nowrap'}).text(`Size: ${size} `),
                            $('<wbr>'),
                            $('<span>', {class: 'text-nowrap'}).text(`Type: ${type}`)
                        );
                        uploadPlaceholder.replaceWith($('<li>').append(preview, label));
                    }

                    $('.fb-upload-preview ol', this.dom).append(uploadPlaceholder);

                    const reader = new FileReader();

                    reader.onload = loadedEvent => {
                        if (file.type && file.type.startsWith('image/')) {
                            const image = new Image();
                            image.onerror = function (error) {
                                uploadPlaceholder.replaceWith($('<li>').append($('<p>').text(`${file.name} of type ${file.type} failed to load. Unsupported image type`)));
                            };
                            image.onload = async function (imageEvent) {

                                // Resize the image
                                const canvas = document.createElement('canvas'),
                                    max_size = self.classConfig.resizeMaxDimension;

                                let width = image.width,
                                    height = image.height;
                                if (width > height && width > max_size) {
                                    height *= max_size / width;
                                    width = max_size;
                                } else if (height > width && height > max_size) {
                                    width *= max_size / height;
                                    height = max_size;
                                }
                                canvas.width = width;
                                canvas.height = height;
                                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                                let dataUri = canvas.toDataURL('image/jpeg');

                                if (self.classConfig.uploadType === 'multipart') {
                                    const hidden = $('<input>', {type: 'file', name: self.config.name + '[]',})[0];
                                    const dt = new DataTransfer();

                                    //toBlob
                                    let binStr = atob(canvas.toDataURL('image/jpeg').split(',')[1]),
                                        len = binStr.length,
                                        arr = new Uint8Array(len);

                                    for (let i = 0; i < len; i++) {
                                        arr[i] = binStr.charCodeAt(i);
                                    }

                                    const newFile = new File([arr], file.name, {type: 'image/jpeg'});
                                    dt.items.add(newFile);
                                    hidden.files = dt.files;
                                    input.after(hidden);

                                    showUploadPreview(dataUri, newFile.name, self.humanReadableFileSize(newFile.size), file.type);
                                } else {
                                    //Upload files as datauris
                                    const hidden = $('<input>', {
                                        type: 'hidden',
                                        name: self.config.name + '[]',
                                        value: dataUri
                                    })[0];
                                    input.after(hidden);

                                    const base64Length = dataUri.length - (dataUri.indexOf(',') + 1);
                                    const padding = (dataUri.charAt(dataUri.length - 2) === '=') ? 2 : ((dataUri.charAt(dataUri.length - 1) === '=') ? 1 : 0);
                                    showUploadPreview(dataUri, file.name, self.humanReadableFileSize(base64Length * 0.75 - padding), 'image/jpeg');
                                }

                                //Remove the file from the original input
                                const fileList = Array.from(input.files);
                                const index = fileList.findIndex(inList => {
                                    return inList === file;
                                });
                                if (index !== -1) {
                                    fileList.splice(index, 1);

                                    const dt = new DataTransfer();
                                    fileList.forEach(pendingFile => {
                                        dt.items.add(pendingFile);
                                    });
                                    input.files = dt.files;
                                }

                            }
                            image.src = loadedEvent.target.result;
                        }
                    }

                    reader.readAsDataURL(file);
                });
            }
        }
    }

    // register this control for the following types & text subtypes
    controlClass.register('photoUpload', controlPhotoUpload);
});