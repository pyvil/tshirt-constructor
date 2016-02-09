/**
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

var _$$jqe = function (obj) {
    if (obj == null) return null;
    this.instance = obj;
};

_$$jqe.size = function() {
    return this.instance.length;
};