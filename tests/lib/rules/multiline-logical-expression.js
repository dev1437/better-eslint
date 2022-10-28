/**
 * @fileoverview Enforce newlines in logical expressions
 * @author dev1437
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/multiline-logical-expression"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("multiline-logical-expression", rule, {
  valid: [
    {
      code: `
      if(someNumber === 0 && withSeveralConditions) {
        doSomething();
      }
      `
    },
    {
      code: `
      someNumber === 0 && withSeveralConditions
      `
    }
  ],

  invalid: [
    {
      code: `
      if(someNumber === 0 && withSeveralConditions) {
        doSomething();
      }
      `,
      output: `
      if(someNumber === 0 &&
       withSeveralConditions) {
        doSomething();
      }
      `,
      errors: [
        {
          messageId: 'always',
          line: 2,
          column: 27
        }
      ],
      options: [{ maxItems: 0}]
    },
    {
      code: `
      if(someNumber === 0 && withSeveralConditions || anotherExpression) {
        doSomething();
      }
      `,
      output: `
      if(someNumber === 0 &&
       withSeveralConditions ||
       anotherExpression) {
        doSomething();
      }
      `,
      errors: [
        {
          messageId: 'always',
          line: 2,
          column: 27
        },
        {
          messageId: 'always',
          line: 2,
          column: 52
        }
      ],
      options: [{ maxItems: 0}]
    },
    {
      code: `
      if(someNumber === 0 && withSeveralConditions || anotherExpression && extraExpression) {
        doSomething();
      }
      `,
      output: `
      if(someNumber === 0 &&
       withSeveralConditions ||
       anotherExpression &&
       extraExpression) {
        doSomething();
      }
      `,
      errors: [
        {
          messageId: 'always',
          line: 2,
          column: 27
        },
        {
          messageId: 'always',
          line: 2,
          column: 52
        },
        {
          messageId: 'always',
          line: 2,
          column: 73
        }
      ],
      options: [{ maxItems: 0}]
    },
    {
      code: `someNumber === 0 && withSeveralConditions || otherCondition`,
      output: `someNumber === 0 &&
 withSeveralConditions ||
 otherCondition`,
      errors: [
        {
          messageId: 'always',
          line: 1,
          column: 18
        },
        {
          messageId: 'always',
          line: 1,
          column: 43
        }
      ],
      options: [{ maxItems: 2}]
    },
    {
      code: `someNumber === 0 && withSeveralConditions || otherCondition`,
      output: `someNumber === 0 &&
 withSeveralConditions ||
 otherCondition`,
      errors: [
        {
          messageId: 'always',
          line: 1,
          column: 18
        },
        {
          messageId: 'always',
          line: 1,
          column: 43
        }
      ],
      options: [{ maxItems: 4, maxLength: 20}]
    }
  ],
});
