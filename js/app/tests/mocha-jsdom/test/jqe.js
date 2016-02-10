/* global describe, before, it, document, expect */

var jsdom = require('../index')
//
describe('jqe', function () {

  var $$jqe
  jsdom()

  before(function () {
    $$jqe = require('../../../helper/jqe.js')
  })

  it('test body tag returns', function () {
    console.log($$jqe('body').size())
  })

})
