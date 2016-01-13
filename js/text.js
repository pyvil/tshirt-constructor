/**
 * author: Vitaliy Pyatin
 */

(function($, document, window) {

    /**
     *
     * @param {Object} param
     * @param {Object|string} param.popupWrapper
     * @param {boolean} param.useDefault = true by default
     * @param {Object|string} param.editor
     * @param {Object|string} param.eventObject
     * @param {Object|string} param.canvas
     * @constructor
     */
    var TextEditor = function (param) {
        this.param = param || {};

        // param that has been passed
        this.param.useDefault = param.useDefault || true;
        this.param.popupWrapper = param.popupWrapper || $('.pyvil_textEditor');
        this.param.editor = param.editor || $('.tshirt_creator_wrapper');

        if ( typeof this.param.popupWrapper === 'string' ) {
            var temp = this.param.popupWrapper;
            if ( temp[0] == '#' || temp[0] == '.' ) {
                this.param.popupWrapper = $(temp);
            } else {
                this.param.popupWrapper = $('.'+temp);
            }
        }

        if ( typeof this.param.editor === 'string' ) {
            var temp = this.param.editor;
            if ( temp[0] == '#' || temp[0] == '.' ) {
                this.param.editor = $(temp);
            } else {
                this.param.editor = $('.'+temp);
            }
        }

        // param to detect default font family
        this.default = [
            "Arial",
            "Times New Roman"
        ];

        // to set canvas
        this.setCanvas(this.param.canvas);

        this.prepareForm();
    };

    TextEditor.prototype = {

        getFonts: function () {
            return [
                "Arial",
                "Times New Roman",
                // google fonts
                "Cookie",
                "Open Sans",
                "Lobster",
                "Bangers",
                "Playball",
                "Oleo Script",
                "Fontdiner Swanky",
                "Black Ops One",
                "Fredericka the Great",
                "Press Start 2P",
                "Cinzel Decorative",
                "Monoton",
                "Kranky",
                "UnifrakturMaguntia",
                "Griffy",
                "Monofett",
                "Sonsie One",
                "Sail",
                "Faster One",
                "Ewert"
            ].sort();
        },

        /**
         * get textarea for input text
         * @returns {string}
         */
        getTextarea : function () {
            return "<textarea id='inputText'>Ваш текст</textarea>";
        },

        /**
         * Here set a fonts contained in this.getFonts()
         * and get an string of options
         * @returns {string}
         */
        getSelectFont : function () {

            var options = null;
            var fonts = this.getFonts();
            for ( var i = 0; i < fonts.length; i++ ) {
                options += "<option value='" + fonts[i] + "' style='font-family:'" + fonts[i] + "';'> " + fonts[i] + " </option>";
            }

            return "<select id='selectFont' class='select'> " + options + " </select>";
        },

        /**
         * get an options with font size values
         * @returns {string}
         */
        getSelectFontSize : function () {
            var options = null;
            var iterator = 10;
            for ( var i = iterator; i <= 36; i += 2 ) {
                options += "<option value='" + i + "'> " + i + " </option>";
            }

            return "<select id='selectFontSize' class='select'> " + options + " </select>";
        },

        /**
         * get styles buttons
         * @returns {string}
         */
        getStylesButton : function () {
            var italicButton = "<div class='styleButton styleItalic'>I</div>"
            var boldButton = "<div class='styleButton styleBold'>B</div>";
            return italicButton + boldButton;
        },

        /**
         * get event object value
         * @returns {Object|string|*}
         */
        getEventObject : function () {
            return this.param.eventObject;
        },

        /**
         * set canvas object
         * @param canvas
         */
        setCanvas : function (canvas) {
            this.canvas = canvas;
        },

        /**
         * get data from text editor fields
         * @returns {Array}
         */
        getTextData : function() {
            var self = this;
            var text = $(self.param.editor).find('#inputText').val();
            var font = $(self.param.editor).find('#selectFont option:selected').val();
            var size = $(self.param.editor).find('#selectFontSize option:selected').val();
            // load from google font that isn't standard
            if (self.default.indexOf(font) == -1){
                WebFont.load({
                    google: {
                        families: [font]
                    }
                });
            }

            var $data = [];
            $data['text'] = text;
            $data['font'] = font;
            $data['size'] = size;

            return $data;
        },

        /**
         * add text
         */
        addTextListener : function () {
            var self = this;
            $(this.param.eventObject).click(function (e) {
                if ((self.canvas.getActiveObject() !== undefined) && (self.canvas.getActiveObject() != null) ) {
                    var obj = self.canvas.getActiveObject();

                    obj.text = self.getTextData()['text'];
                    obj.fontSize = self.getTextData()['size'];
                    obj.fontFamily = self.getTextData()['font'];

                    self.canvas.renderAll();
                    return 1;
                }

                var data = self.getTextData();

                var fText = new fabric.Text(data['text'], {
                    fontSize : data['size'],
                    fontFamily : data['font']
                });

                fText.on('selected', function (option) {
                    var obj = self.canvas.getActiveObject();
                    $(self.param.editor).find('#inputText').val(obj.text);
                    $(self.param.editor).find('#selectFont option[value="' + obj.fontFamily + '"]').attr('selected', '');
                    $(self.param.editor).find('#selectFontSize option[value="' + obj.fontSize + '"]').attr('selected', '');
                });
                self.canvas.add(fText);
                fText.center();
                fText.setCoords();
                self.canvas.renderAll();
            });

            /*$('.styleItalic').bind('click', function (e) {

            });

            $('.styleBold').bind('click', function (e) {

            });*/
        },

        /**
         * set form
         * @returns {boolean}
         */
        prepareForm : function () {
            if (this.canvas === {})
                return false;

            if ( this.param.useDefault ) {
                $(this.param.popupWrapper).html(
                     "<div class='properties'>" +
                        "<label>Свойства текста</label>" +
                        this.getSelectFont() +
                        this.getSelectFontSize() +
                        //this.getStylesButton() +
                    "</div>" +
                    "<div class='properties'>" +
                        "<label>Текст</label>" +
                        this.getTextarea() +
                    "</div>" 
                );
            }
            // set click listener
            this.addTextListener();
        }
    };
    
    // register object
    window.TextEditor = TextEditor || {};

} (jQuery, document, window));