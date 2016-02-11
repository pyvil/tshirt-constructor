/**
 *
 * @param obj
 * @returns {*}
 * @private
 */
var _$$jqe = function (obj) {
    var instance = obj;

    /**
    * Get object amount in DOM
    *
    * @return numeric
    */
    this.size = function () {
       return instance.length;
    };

    /**
    * Get needed element in list
    *
    * @return object
    */
    this.get = function (index) {
       if (instance instanceof NodeList) {
           instance = instance.item(index);
       }
       return this;
    }

    /**
    * Get first element
    *
    * @return object
    */
    this.first = function () {
        this.get(0);

        return this;
    }

    /**
    * Get last element
    *
    * @return object
    */
    this.last = function () {
        this.get(this.size() - 1);

        return this;
    }


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

            switch (typeOf) {
              // if id give
              case '#' :
                  obj = document.querySelector(proton);
                  break;

                // if html tag given
                default :
                    obj = document.querySelectorAll(proton);
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
