/**
 *
 * @param obj
 * @returns {*}
 * @private
 */
var _$$jqe = function (obj) {
    this.instance = obj;

    /**
    * Get object amount in DOM
    *
    * @return numeric
    */
    this.size = function () {
       return this.instance.length;
    };



    return this;
};



/**
 * The main class which depend on {_$$jqe} class
 *
 * @param proton
 */
var $$jqe = function (proton) {
    /**
     * Transform to object given @param
     * or return the object if object given
     *
     * @param proton
     */
    var toObj = function (proton) {
        var obj    = null;
        if (typeof proton == 'string') {
            var typeOf = proton.charAt(0);
            var name   = proton.replace('.', '');
            name       = proton.replace('#', '');
            switch (typeOf) {
                // if class given
                case '.' :
                    obj = document.getElementsByClassName(name);
                    break;

                // if id give
                case '#' :
                    obj = document.getElementById(name);
                    break;

                // if html tag given
                default :
                    obj = document.getElementsByTagName(name);
                    break;
            }
        }else if(typeof proton == 'object') {
            obj = proton;
        }

        return obj;
    };

    return new _$$jqe(toObj(proton));
};
module.exports = $$jqe;
