/**
 * Testing cases for module JQE
 * Tests runs with DOM elements
 */

// DOM stuff
var jsdom = require('../index')

// test stuff
var assert = require('assert');

describe('jqe', function () {

    var $$jqe

    jsdom()

    before(function () {
        $$jqe = require('../../../helper/jqe.js')
    })

    it('must return NodeList when select not id elements', function () {
         assert.equal(true, ($$jqe('body') instanceof NodeList))
    })

    it('should not return null or undefined', function () {
        assert.notEqual(null || undefined, $$jqe('q'));
    })

    it('should be only 1 body tag', function () {
        assert.equal(1, $$jqe('body').size())
    })

})
