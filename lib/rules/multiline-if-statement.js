/**
 * @fileoverview Format if statement brackets
 * @author Dev1437
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout', // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Format if statement brackets",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'whitespace', // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
    messages: {
      'always': 'Expected newline',
    }
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    const sourceCode = context.getSourceCode();

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      IfStatement(node) {
        if (node.test.loc.start.line !== node.test.loc.end.line && (node.test.loc.start.line === node.loc.start.line || sourceCode.getText(node.test, 0, 1).endsWith(')'))) {
          
          context.report({
            node,
            loc: node.loc,
            messageId: "always",
            fix(fixer) {
              return fixer.replaceTextRange([node.test.range[0], node.test.range[1]], `\n${" ".repeat(node.test.loc.start.column - 1 > 0? node.test.loc.start.column - 1 : 0)}${context.getSourceCode().getText(node.test)}\n${" ".repeat(node.loc.start.column > 0? node.loc.start.column : 0)}`)
            }
          });
        }
      }
    };
  },
};
