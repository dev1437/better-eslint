/**
 * @fileoverview Format if statement brackets
 * @author Dev1437
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/multiline-if-statement"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("multiline-if-statement", rule, {
  valid: [
    {
      code: `
      if(
        someNumber === 0 &&
        withSeveralConditions ||
        anotherExpression &&
        extraExpression
      ) {
        doSomething();
      }
      `
    },
    {
      code: `
      if(someNumber === 0 && withSeveralConditions || anotherExpression && extraExpression) {
        doSomething();
      }
      `
    }
  ],

  invalid: [
    {
      code: `
      if(someNumber === 0 &&
        withSeveralConditions ||
        anotherExpression &&
        extraExpression) {
        doSomething();
      }
      `,
      output: `
      if(
        someNumber === 0 &&
        withSeveralConditions ||
        anotherExpression &&
        extraExpression
      ) {
        doSomething();
      }
      `,
      errors: [
        {
          messageId: 'always',
          line: 2,
          column: 7
        }
      ]
    }
  ],
});
