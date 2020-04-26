const {ipcRenderer} = require('electron')

$.fn.cssAsHex = function (colorProp) {

    var hexDigits = '0123456789abcdef';

    function hex(x) {
        return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }

    function rgb2hex(rgb) {
        var rgbRegex = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        return '#' + hex(rgbRegex[1]) + hex(rgbRegex[2]) + hex(rgbRegex[3]);
    }

    return rgb2hex(this.css(colorProp));
};

$(document).ready(() => {
    const $body = $('body');
    const $swatchesContainer = $('#swatches-container');

    const renderSwatches = (swatches) => {

        $swatchesContainer.empty();
        const swatchTemplate = $.templates('#swatch-template');

        const $renderedSwatches = $(swatchTemplate.render(swatches));
        $swatchesContainer.append($renderedSwatches);

        const $colorPickers = $renderedSwatches.find('.swatch-color');
        $colorPickers.colorpicker();

        $colorPickers.on('colorpickerChange', (evt) => {
            const $this = $(evt.target);
            const newColor = evt.color.toString();
            $this.css('background-color', newColor);
            $this.css('color', newColor);
        });
        $colorPickers.on('colorpickerHide', (evt) => {
            updateSwatch($(evt.target));
        });
    };

    const getDataFromSwatch = ($swatch) => {
        const id = $swatch.attr('data-id');
        const name = $swatch.find('.swatch-name-edit input').val();
        const color = $swatch.find('.swatch-color').cssAsHex('background-color');
        return {
            id: id,
            name: name,
            color: color
        }
    };

    const updateSwatch = ($elem) => {
        const $swatch = $elem.parents('.swatch');

        const {id, name, color} = getDataFromSwatch($swatch);

        ipcRenderer.send('swatch-update', {
            id: id,
            name: name,
            color: color
        });
    }

    ipcRenderer.on('swatches-reload', (evt, arg) => {
        const fileName = arg.fileName;
        const $fileName = $('#open-file');
        $fileName.text(fileName ? fileName : 'No file open!');

        renderSwatches(arg.swatches);
    });

    $('#new-swatch').click((evt) => {
        evt.preventDefault();

        const newId = ($swatchesContainer.find('.swatch').length + 1).toString();
        const newName = 'New Color';
        const newColor = '#000';
        ipcRenderer.send('swatch-create', {
            id: newId,
            name: newName,
            color: newColor
        });
    });

    $body.on('click', '.swatch-remove', (evt) => {
        evt.preventDefault();
        const $this = $(evt.target);

        const id = $this.parents('.swatch').attr('data-id');
        ipcRenderer.send('swatch-remove', {
            id: id
        });
    });

    $body.on('click', '.edit-name', (evt) => {
        evt.preventDefault();
        const $this = $(evt.target);

        $this.parents('.swatch').find('.swatch-name-edit').toggleClass('d-none');
        $this.parents('h6').addClass('d-none');
    });

    $body.on('blur', '.swatch-name-edit input', (evt) => {
        evt.preventDefault();
        updateSwatch($(evt.target));
    });

    $body.on('submit', '.swatch-name-edit', (evt) => {
        evt.preventDefault();
        updateSwatch($(evt.target));
    });

    $('#importImageModalImport').click((evt) => {
        evt.preventDefault();
        const $this = $(evt.target);
        const $modal = $this.parents('.modal');

        const tileWidth = parseInt($modal.find('#tileWidth').val());
        const tileHeight = parseInt($modal.find('#tileHeight').val());

        ipcRenderer.send('import-start', {
            tileWidth: tileWidth,
            tileHeight: tileHeight
        });

        $modal.modal('hide');
    });

    $body.on('click', '.modify-color', (evt) => {
        evt.preventDefault();
        const $this = $(evt.target);
        const $swatchColor = $this.parents('.swatch').find('.swatch-color');
        const currentColor = $swatchColor.cssAsHex('background-color');

        const shouldDarken = $this.hasClass('darken');
        const col = tinycolor(currentColor);
        if (shouldDarken) {
            col.darken(5);
        } else {
            col.brighten(5);
        }

        $swatchColor.css('background-color', col.toString());
        updateSwatch($this);
    });

    $body.on('click', '.clone-color', (evt) => {
        evt.preventDefault();
        const $this = $(evt.target);

        const {name, color} = getDataFromSwatch($this.parents('.swatch'));
        const newId = ($swatchesContainer.find('.swatch').length + 1).toString();

        ipcRenderer.send('swatch-create', {
            id: newId,
            name: name + '-Clone',
            color: color
        });
    })
});