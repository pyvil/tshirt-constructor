var assert = require('assert');
var helper = require('../../helper/utils');
describe('test', function () {
    it('should return 1', function() {
        assert.equal(-1, helper.toInt('-1'));
        //assert.equal(-1, [1,2,3].indexOf(0));
    })
})