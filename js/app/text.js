/**
 * @author Vitaliy Pyatin <mail.pyvil@gmail.com>
 * @copyright 2016
 */

var TC = (function(){

    // set alias
    var self = this;

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
    this.TextEditor = function (param) {
      self.param = param || {};

      // param that has been passed
      self.param.useDefault = param.useDefault || true;
      self.param.popupWrapper = this.helper.utils.toObj(param.popupWrapper) || $('.pyvil_textEditor');
      self.param.editor = this.helper.utils.toObj(param.editor) || $('.tshirt_creator_wrapper');

      // param to detect default font family
      self.default = [
          "Arial",
          "Times New Roman"
      ];

      // to set canvas
      self.setCanvas(self.param.canvas);

      self.prepareForm();
    };

    /**
    * Get available list of fonts
    * @returns Array
    */
    this.TextEditor.getFontsList = function () {
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
    };

    /**
     * Here set a fonts contained in this.getFonts()
     * and get an string of options
     * @returns {string}
     */
    this.TextEditor.getFontsListHtml = function () {
        var options = null;
        var fonts = this.TextEditor.getFontsList();
        for ( var i = 0; i < fonts.length; i++ ) {
            options += "<option value='" + fonts[i] + "' style='font-family:'" + fonts[i] + "';'> " + fonts[i] + " </option>";
        }

        return "<select id='selectFont' class='select'> " + options + " </select>";
    };

    /**
     * get textarea for input text
     * @returns {string}
     */
    this.TextEditor.getTextareaHtml = function () {
        return "<textarea id='inputText'>Ваш текст</textarea>";
    };

    /**
    * Get list of font-size
    * @param {number} [from] - default 10 - from what font-size start
    * @param {number} [to] - default 36 - to what font-size
    * @param {number} [step] - default 2 - step for generating
    * @returns {array}
    */
    this.TextEditor.getFontSizeList = function(from, to, step) {
       from = from || 10;
       to   = to || 36;
       step = step || 2;

       var data = [];

       for (var i = from; i <= to; i += step) {
          data.push(i);
       }

       return data;
    }

    /**
    * Get list of font-size in HTML select tag
    * @param {number} [from] - default 10 - from what font-size start
    * @param {number} [to] - default 36 - to what font-size
    * @param {number} [step] - default 2 - step for generating
    * @returns {array}
    */
    this.TextEditor.getFontSizeListHtml = function (from, to, step) {
        var data = this.TextEditor.getFontSizeList (from, to, step);
        var option = null;

        data.forEach(function(item) {
            options += "<option value='" + item + "'> " + item + " </option>";
        });

        return "<select id='selectFontSize' class='select'> " + options + " </select>";
    };

    /**
     * get styles buttons
     * @returns {string}
     */
    this.TextEditor.getStylesButtonHtml = function () {
        var italicButton = "<div class='styleButton styleItalic'>I</div>"
        var boldButton = "<div class='styleButton styleBold'>B</div>";
        return italicButton + boldButton;
    };

    /**
     * get event object value
     * @returns {Object|string|*}
     */
    this.TextEditor.getEventObject = function () {
        return self.param.eventObject;
    };

    /**
     * set canvas object
     * @param canvas
     */
    this.TextEditor.setCanvas = function (canvas) {
        self.canvas = canvas;
    };

    /**
     * get data from text editor fields
     * @returns {Array}
     */
    this.TextEditor.getTextData = function() {
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
    };

    /**
     * add text
     */
    this.TextEditor.addTextListener = function () {
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
    this.TextEditor.prepareForm = function () {
        if (self.canvas === {})
            return false;

        if ( self.param.useDefault ) {
            $(self.param.popupWrapper).html(
                 "<div class='properties'>" +
                    "<label>Свойства текста</label>" +
                    this.TextEditor.getFontsListHtml() +
                    this.TextEditor.getFontSizeListHtml() +
                    //this.getStylesButton() +
                "</div>" +
                "<div class='properties'>" +
                    "<label>Текст</label>" +
                    this.TextEditor.getTextareaHtml() +
                "</div>"
            );
        }
        // set click listener
        this.TextEditor.addTextListener();
    }


    return this;
}).apply(TC);
