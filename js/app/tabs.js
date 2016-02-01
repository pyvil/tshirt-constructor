/**
 * Tabs manipulate module
 * write in pure javascript
 *
 * Use:
 * The code below shows how to markup tabs header
 * Where:
 *  .tab - class used to indicate the tab item
 *  .active_tab - used to indicate active tab item
 *  .ts_tab_item - used to indicate tab content
 *
 *  data-target - is an attribute to indicate each tab content, used for search single tab content
 *  data-type - is an attribute to indicate each tab, used for search single tab
 *
 *  //The classes above is totally customize, so you can use own class name
 *
 *<code>
 *     <ul>
 *          ...
 *          <li><a class="tab active_tab" data-type="1" href="#">Тип</a></li>
 *          ...
 *     </ul>
 *</code>
 *
 * author: Vitaliy Pyatin
 *
 */

(function ($, window, document) {

    /**
     * @param {Object}        param
     * @param {Object|string} param.tabIndicate, by default equal "tab"
     * @param {Object|string} param.tabContentIndicate
     * @param {string} param.activeTab
     * @constructor
     */
    var Tab = function (param) {

        this.param                      = param || {};

        console.log(this.param);

        if ( this.param !== {} ) {

            if ( typeof this.param.tabIndicate === 'string' ) {
                this.param.tabIndicate = this.param.tabIndicate[0] == '.' ||  this.param.tabIndicate[0] == '#' ? $(this.param.tabIndicate) : $('.' + this.param.tabIndicate);
            }

            if ( typeof this.param.tabContentIndicate === 'string' ) {
                this.param.tabContentIndicate = this.param.tabContentIndicate[0] == '.' ||  this.param.tabContentIndicate[0] == '#' ? $(this.param.tabContentIndicate) : $('.' + this.param.tabContentIndicate);
            }

            if ( typeof this.param.activeTab === 'string' ) {
                this.param.activeTab = this.param.activeTab[0] == '.' ||  this.param.activeTab[0] == '#' ? this.param.activeTab.substr(1, this.param.activeTab.length - 1) :  this.param.activeTab;
            }

        }

        this.param.tabIndicate          = this.param.tabIndicate || $('.tab');
        this.param.tabContentIndicate   = this.param.tabContentIndicate || $('.ts_tab_item');
        this.param.activeTab            = this.param.activeTab || 'active_tab';

        this.prefix                     = this.param.activeTab[0] == '#' ? this.param.activeTab[0] : '.';

        this.init();
    };

    Tab.prototype = {

        init : function () {

            this.activateTab();
            this.tabClick();

        },

        activateTab : function () {
            this.index = $(this.prefix + this.param.activeTab).first().attr('data-type');

            if ( this.index == 0 ){
                $(this.param.tabContentIndicate).first().addClass(this.param.activeTab);
            }

            $(this.param.tabContentIndicate).parent().find('*[data-target = "' + this.index + '"]').fadeIn('fast');
        },

        tabClick : function () {

            var self = this;

            $(this.param.tabIndicate).bind('click', function (e) {

                if ( $(this).hasClass(self.param.activeTab ) ) return false;

                $(self.prefix + self.param.activeTab).removeClass(self.param.activeTab);
                $(this).addClass(self.param.activeTab);
                $(self.param.tabContentIndicate).parent().find('*[data-target = "' + self.index + '"]').fadeOut('fast');

                self.activateTab();

            });

        }

    };

    $(document).ready(function () {

        new Tab();

    });

} (jQuery, window, document) );