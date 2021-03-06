'use strict';

var chai = require('chai'),
  pp = require('../lib/preprocess');

chai.should();

describe('@exclude directive shall be preprocessed', function () {
  var input;

  describe('in html', function () {
    it('with default notation', function () {
      input = "a<!-- @exclude -->b<!-- @endexclude -->c";
      pp.preprocess(input, {}).should.equal("ac");
    });

    it('multiple excludes in one line', function () {
      input = "a<!-- @exclude -->b<!-- @endexclude -->c<!-- @exclude -->d<!-- @endexclude -->e";
      pp.preprocess(input, {}).should.equal("ace");
    });

    it('with newlines', function () {
      input = "a\n<!-- @exclude -->\nb\n<!-- @endexclude -->\nc";
      pp.preprocess(input, {}).should.equal("a\nc");
    });
  });

  describe('in javascript', function () {
    it('with line comments', function () {
      input = "a\n// @exclude\nb\n// @endexclude\nc";
      pp.preprocess(input, {}, 'js').should.equal("a\nc");
    });

    it('with block comments', function () {
      input = "a/* @exclude */b/* @endexclude */c";
      pp.preprocess(input, {}, 'js').should.equal("ac");
    });

    it('multiple excludes in one line', function () {
      input = "a\n/* @exclude */\nb\n/* @endexclude */\nc";
      pp.preprocess(input, {}, 'js').should.equal("a\nc");
    });
  });

  describe('in coffeescript', function () {
    it('with default notation', function () {
      input = "a\n# @exclude\nb\n# @endexclude\nc";
      pp.preprocess(input, {}, 'coffee').should.equal("a\nc");
    });

    it('with multiple hashes', function () {
      input = "a\n## @exclude\nb\n## @endexclude\nc";
      pp.preprocess(input, {}, 'coffee').should.equal("a\nc");
    });
  });

  describe('and shall allow omitting of whitespaces', function () {
    it('in html before and after the directive', function () {
      input = "a<!--@exclude-->b<!--@endexclude-->c";
      pp.preprocess(input, {}).should.equal("ac");
    });

    describe('in javascript', function () {
      it('before and after the directive (block)', function () {
        input = "a/*@exclude*/b/*@endexclude*/c";
        pp.preprocess(input, {}, 'js').should.equal("ac");
      });

      it('before the directive (line)', function () {
        input = "a\n//@exclude\nb\n//@endexclude\nc";
        pp.preprocess(input, {}, 'js').should.equal("a\nc");
      });
    });

    it('in coffeescript before the directive', function () {
      input = "a\n#@exclude\nb\n#@endexclude\nc";
      pp.preprocess(input, {}, 'coffee').should.equal("a\nc");
    });
  });
});