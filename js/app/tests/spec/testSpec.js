var helper = require('../../helper/utils.js')

describe('test', function(){
    it('should return 1', function(){
        expect(helper.utils.helper.toInt('1')).toEqual(1)
    })
})