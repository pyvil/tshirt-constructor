/**
 * Helper object
 * @type {{toObj: Function}}
 */
var helper = {
    /**
     * Helper: convert variable to Object value
     * @param value
     * @returns {Object}
     */
    toObj : function(value) {
        if (typeof value == 'string') {
            value = value.replace('.', '');
            value = value.replace('#', '');
            var target = document.getElementById(value);
            if (target != null) return target;
            return document.getElementsByClassName(value);
        } else if (typeof value == 'object') {
            return value;
        }
        return null;
    }
};

/**
 *
 * @param proton
 */
var $$jqe = function (proton) {
    return new _$$jqe(helper.toObj(proton));
};

_$$jqe = function (obj) {this.instance = obj};

_$$jqe.prototype.log = function () {
    console.log(this.instance);
};