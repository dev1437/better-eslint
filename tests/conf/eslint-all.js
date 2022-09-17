/**
 * @fileoverview Tests for eslint-all.
 * @author Alberto Rodríguez
 */

"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const assert = require("chai").assert;
const eslintAll = require("../../conf/eslint-all");
const rules = eslintAll.rules;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

describe("eslint-all", () => {
    it("should only include rules", () => {
        const ruleNames = Object.keys(rules);

        assert.notInclude(ruleNames, ".eslintrc.yml");

    });

    it("should return all rules", () => {
        const ruleNames = Object.keys(rules);
        const count = ruleNames.length;
        const someRule = "max-len-newline-perchained-call";

        assert.include(ruleNames, someRule);
        assert.isAbove(count, 0);
    });

    it("should configure all rules as errors", () => {
        const ruleNames = Object.keys(rules);
        const nonErrorRules = ruleNames.filter(ruleName => rules[ruleName] !== "error");

        assert.strictEqual(nonErrorRules.length, 0);
    });
});