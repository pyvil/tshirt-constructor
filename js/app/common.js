/**
 * author: Vitaliy Pyatin
 */
(function ($, window, document) {

    /**
     * @param {Object} param
     * @param {string} param.type - type of t-shirt ( man/women etc. )
     * @param {string|int} param.id - t-shir id
     * @param {Object|string} param.imageContainer
     * @param {Object|string} param.imageContainerDesign
     * @param {Object} param.target - HTML img object or id where place chosen t-shirt
     * @param {string} param.frontCanvas
     * @param {string} param.backCanvas
     * @constructor
     */
    var TShirt = function ( param ) {
        this.param = param || {};

        // set default values
        if ( this.param == {} ) {
            this.param.type = 'man';
            this.param.id = 1;
        }

        if ( typeof this.param.imageContainer === 'string') {
            var temp = this.param.imageContainer;
            if ( temp[0] == '#' || temp[0] == '.' ) {
                this.param.imageContainer = $(temp);
            } else {
                this.param.imageContainer = $('.'+temp);
            }
        }

        // Fabric main canvas to draw on
        this.canvas = new fabric.Canvas('main_canvas');

        // Convert current canvas to JSON
        this.canvasJSON = null;

        // Price for print size
        this.printSizePrice = 0;
        this.printSizePriceBack = 0;
        this.isFront = true;

        this.getAllTShirts();
        this.getDesignes();
        this.setImageListener();
        this.setKeyListener();
        this.setBFListener();
        this.setChangeSizeList();

        this.order();
    };

    /**
     * Methods describes
     * @type {{}}
     */
    TShirt.prototype = {

        /**
         * refresh price
         */
        refreshPrice : function () {
            // get price form y-shirt price and price of print size
            var price = this.printSizePrice + this.printSizePriceBack + parseFloat($(this.param.target).attr('data-price'));
            $('#totalPrice').find('span').text(price);
        },

        /**
         * get all t-shirts
         */
        getAllTShirts : function(){

            var self = this;

            $.ajax({
                type: "post",
                url: "/media/get-tshirt",
                data: 'type=all',
                success: function (response) {

                    var image = JSON.parse(response);

                    $(self.param.imageContainer).html('');

                    for ( var i = 0; i < image.length; i++ ) {
                        $(self.param.imageContainer).append( // class="thumbnails"
                            '<img src="/img/constructor/tshirt/'+ image[i]["image"] +'" data-type="'+ image[i]["type"] +'" data-id="'+ image[i]["id"] +'">'
                        );
                    }

                    self.getTShirt(image[0]['type'], image[0]['id']);

                    console.log ( 'upload success' );
                },
                error: function (response) {

                    console.log(response);

                }
            });
        },

        /**
         * get all t-shirts by type
         * @param {string} type
         */
        getTShirtsByType : function ( type ) {
            type = type || this.param.type;
            var self = this;

            $.ajax({
                type: "post",
                url: "/media/get-tshirt",
                data: 'type='+type, //+'&id='+self.param.id,
                success: function (response) {

                    var image = JSON.parse(response);

                    $(self.param.imageContainer).html('');

                    for ( var i = 0; i < image.length; i++ ) {
                        $(self.param.imageContainer).append( // class="thumbnails"
                            '<img src="/img/constructor/tshirt/'+ image[i]["image"] +'" data-type="'+ image[i]["type"] +'" data-id="'+ image[i]["id"] +'">'
                        );
                    }

                    console.log ( image );
                    //console.log ( 'upload success' );
                    self.setType( type );
                },
                error: function (response) {

                    console.log(response);

                }
            });
        },

        /**
         * get single t-shirt by type and id, because they (type, id) must be unique
         * @param {string} type
         * @param {string|int} id
         */
        getTShirt : function ( type, id ) {
            type = type || this.param.type;
            id = id || this.param.id;
            var self = this;

            $.ajax({
                type: "post",
                url: "/media/get-tshirt",
                data: /*'type='+type+'&id='+id*/'id='+id,
                success: function (response) {

                    var image = JSON.parse(response);
                    $(self.param.target).attr('src', '/img/constructor/tshirt/'+image[0]['image']);
                    $(self.param.target).attr('data-price', image[0]['price']);

                    self.refreshPrice();

                    //self.canvas.backgroundImage = new fabric.Image('/img/constructor/tshirt/'+image[0]['image'];
                    //self.canvas.render();

                    $('#t_front').attr('src', '/img/constructor/tshirt/'+image[0]['image']);
                    $('#t_back').attr('src', '/img/constructor/tshirt/'+image[1]['image']);

                    console.log(image);

                    console.log ( 'upload success' );
                    self.setType( type );
                    self.setId( id );
                },
                error: function (response) {

                    console.log(response);

                }
            });
        },

        /**
         * get all pictures for decorating t-shirt
         */
        getDesignes : function () {

            var self = this;

            $.ajax({
                type: "post",
                url: "/media/upload-design",
                data: 'type=all',
                success: function (response) {

                    $(self.param.imageContainerDesign).html('');

                    var image = JSON.parse(response);

                    console.log(image);
                    console.log(response);

                    $(self.param.imageContainerDesign).html('');

                    for ( var i = 0; i < image.length; i++ ) {
                        $(self.param.imageContainerDesign).append(
                            '<img class="thumbnails_des" src="/img/constructor/design/'+ image[i]["image"] +'" >'
                        );
                    }

                    console.log ( 'upload success' );
                },
                error: function (response) {

                    console.log(response);

                }
            });
        },

        /**
         * Allows to switch between front-part and back-part
         * of the t-shirt
         */
        setBFListener : function () {

            var self = this;

            $('.exemple-photo').delegate('img', 'click', function (e) {

                if ( $(this).hasClass('t_active') ) return false;

                $('.t_active').removeClass('t_active');
                $(this).addClass('t_active');

                var JSON = self.canvas.toJSON();

                self.canvas.clear();

                if ( self.canvasJSON !== null )
                    self.canvas.loadFromJSON(self.canvasJSON, function() {
                        self.canvas.renderAll();
                        self.canvas.calcOffset();
                    });

                self.canvasJSON = JSON;

                self.isFront = !self.isFront;

                $(self.param.target).attr('src', $(this).attr('src'));
                self.canvas.renderAll();
            });

        },

        /**
         * use HTML select to choose
         * @param {Object} selectObject
         * @param {string} what - what you wanna select: id, type
         */
        select : function (selectObject, what) {

            what = what || '';

            var self = this;

            $(selectObject).change (function (e) {
                switch (what){
                    case 'type':
                        self.getTShirtsByType($(this).val());
                        break;

                    default :
                        self.getTShirtsByType($(this).val());
                        break;

                }
            } );

        },

        /**
         * set click event on images for using one
         */
        setImageListener : function () {
            // detect alias
            var self = this;

            // here we choose which t-shirt we're want to
            $('._tshirts').delegate('.thumbnails','click', function (e) {
                // get current attributes to detected single t-shirt
                var type = $(this).attr('data-type');
                var id = $(this).attr('data-id');

                // choose one
                self.getTShirt(type, id);
            });

            // here we choose
            $('._des').delegate('.thumbnails_des','click', function (e) {
                var url = $(this).attr('src');

                self.image = fabric.Image.fromURL(
                    url,
                    function (img) {
                        // remove images on canvase
                        for (var i = 0; i < self.canvas.getObjects().length; i++) {
                            var obj = self.canvas.item(i);
                            if (obj instanceof fabric.Image) {
                                self.canvas.remove(obj);
                                if (self.isFront)
                                    self.printSizePrice = 0;
                                else
                                    self.printSizePriceBack = 0;

                                self.refreshPrice();
                            }
                        }

                        // if image has a right width
                        if ( 115 < img.width ) {
                            // if not - scale it
                            var
                                ratio,
                                maxWidth = 115,
                                maxHeight = 115;

                            ratio = ( img.width > img.height ) ? maxWidth / img.width : maxHeight / img.height;

                            img.width *= ratio;
                            img.height *= ratio;
                        }

                        img.hasControls = false;

                        self.canvas.add(img);
                        img.center();
                        img.setCoords();
                        self.canvas.setActiveObject(img);

                        var val = $('#print_size').find('option').last().val();
                        $('#print_size').val(val);
                        $('#print_size').trigger('change');
                    });
            });


        },

        /**
         * set key listener detected when to delete selected item
         */
        setKeyListener : function () {

            var self = this;

            $(document).bind('keypress', function (e) {

                if (e.keyCode == 127 ) {
                    var obj = self.canvas.getActiveObject();
                    if (obj instanceof fabric.Image){
                        if (self.isFront)
                            self.printSizePrice = 0;
                        else
                            self.printSizePriceBack = 0;
                        self.refreshPrice();
                    }
                    self.canvas.remove(obj);
                }
            });

            $('.deleteButton').bind('click', function (e) {
                var obj = self.canvas.getActiveObject();
                if (obj instanceof fabric.Image){
                    if (self.isFront)
                        self.printSizePrice = 0;
                    else
                        self.printSizePriceBack = 0;
                    self.refreshPrice();
                }
                self.canvas.remove(obj);
            });

        },

        /**
         * change image size using combobox
         *
         * 3.795276 - mm in px
         */
        setChangeSizeList : function () {
            var self = this;
            $('#print_size').change(function (e) {

                if ($(this).val() == 0){
                    return 0;
                }

                var size = $(this).val().toLowerCase().split('x') || $(this).val().toLowerCase().split('х');
                var img = self.canvas.getActiveObject();

                // set price for current print
                if (self.isFront)
                    self.printSizePrice = parseFloat($('#print_size').find('option:selected').attr('data-price'));
                else
                    self.printSizePriceBack = parseFloat($('#print_size').find('option:selected').attr('data-price'));

                self.refreshPrice();

                var maxWidth = parseInt(size[0], 10) / 3.795276;
                var maxHeight = parseInt(size[1], 10) / 3.795276;

                var ratio = ( img.width > img.height ) ? maxWidth / img.width : maxHeight / img.height;

                img.width *= ratio;
                img.height *= ratio;

                self.canvas.renderAll();
                console.log([img.width, img.height, size]);
            });
        },

        /**
         * set t-shirt id
         * @param id
         */
        setId : function ( id ) {
            this.param.id = id;
        },

        /**
         * set t-shirt type
         * @param type
         */
        setType : function ( type ) {
            this.param.type = type;
        },

        /**
         * get current id
         * @returns {*}
         */
        getId : function () { return this.param.id  },

        /**
         * get current type
         * @returns {*}
         */
        getType : function () { return this.param.type  },

        /**
         * Making a pictures from two parts of the t-shirt
         * to send those through ajax on the server
         * and send e-mail to owners
         *
         * pictures makes via html2canvas library
         */
        makeSnapshot : function () {
            var self = this;
            $('.__front').bind('click', function () {
                // switch to front-part of t-shirt
                $('#t_front').trigger('click');
                // make a 'snapshot' of front-part of the t-shirt
                html2canvas(document.getElementById('t-shirt_data'))
                    .then(function(canvas) {
                        // makes request parameter with front-part 'snapshot'
                        self.datas = "data_fr=" + canvas.toDataURL('image/png');

                        // switch to back-part of the t-shirt
                        $('#t_back').trigger('click');

                        // make a snapshot of the t-shirt
                        html2canvas(document.getElementById('t-shirt_data'))
                            .then(function(canvas) {
                                // makes request parameter with back-part 'snapshot'
                                self.datas += '&data_ba=' + canvas.toDataURL('image/png');

                                 // prepare to send an ajax request
                                 // get rest of the information to send email
                                 var size = $('input[name=size]:checked').val();
                                 var price = $("#totalPrice").find('span').text();
                                 var phone = $('#phone').val();
                                 var print = $('#print_size').val();

                                 if (phone.trim() == ''){
                                     alert ('Введите, пожалуйста, Ваш телефон, чтобы мы могли с вами связаться!');
                                     return false;
                                 }

                                 $.ajax({
                                     type: "post",
                                     url: "/media/send-mail",
                                     data: self.datas+'&price='+price+'&phone='+phone+'&print='+print+'&size='+size,
                                     success: function (response) {
                                        alert('Ваш заказ успешно оформлен! Мы Вам перезвоним! Спасибо, что Вы с нами!');
                                     },
                                     error: function (response) {

                                        console.log(response);

                                     }
                                 });
                            });
                    });
            });
        },

        /**
         * create order on created t-shirt
         */
        order : function() {
            var self = this;
            $('.book').bind('click', function (e) {
                // prepare
                self.makeSnapshot();

                // call click event in makeSnapshot() function
                $(".__front").trigger('click');
            });
        }
    };

    window.onload = function () {

        var $tShirt = new TShirt({
            //imageContainer : $(".photo"),
            target : $("#_thsirt"),
            imageContainerDesign : $('._des'),
        });

        //$tShirt.select($('.select'), 'type');

        var $text = new window.TextEditor({
            eventObject : $("#add_text"),
            canvas : $tShirt.canvas,
            popupWrapper : $('.text-properties')
        });

        $($text.getEventObject()).bind('click', function(){
            $text.setCanvas($tShirt.canvas);
        });
    }

} (jQuery, window, document) );