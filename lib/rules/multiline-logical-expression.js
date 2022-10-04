/**
 * @fileoverview Enforce newlines in logical expressions
 * @author dev1437
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
      description: "Enforce newlines in logical expressions",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'whitespace', // Or `code` or `whitespace`
    schema: [{
      type: 'object',
      properties: {
        maxLength: { type: 'number' },
        maxItems: { type: 'number' }
      },
    }],
    messages: {
      'always': 'Expected newline',
    }
  },

  create(context) {
        
    let options = context.options[0] || {
      maxLength: 80,
      maxItems: 3
    }
      
    let maxLength =  options.maxLength
    let maxItems = options.maxItems

    const sourceCode = context.getSourceCode();

    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------


    /**
     * Checks the operator placement
     * @param {ASTNode} node The node to check
     * @param {ASTNode} rightSide The node that comes after the operator in `node`
     * @param {string} operator The operator
     * @private
     * @returns {void}
     */
    function validateNode(node, rightSide, operator) {

        /*
         * Find the operator token by searching from the right side, because between the left side and the operator
         * there could be additional tokens from type annotations. Search specifically for the token which
         * value equals the operator, in order to skip possible opening parentheses before the right side node.
         */
        const operatorToken = sourceCode.getTokenBefore(rightSide, token => token.value === operator);
        let parent = node.parent
        if (parent.type !== "LogicalExpression") {
          parent = node
        } else {
          while (parent.parent?.type === "LogicalExpression") {
            parent = parent.parent
          }
        }

        let children = 1;
        let left = parent.left

        while (left && left.left) {
          children += 1;
          left = left.left
        }
        let right = parent.right
        while (right && right.right) {
          children += 1;
          right = right.right
        }
        if (parent.range[1] - parent.range[0] >= maxLength || children >= maxItems) {
          context.report({
            node,
            loc: operatorToken.loc,
            messageId: "always",
            fix(fixer) {
              return fixer.replaceText(operatorToken, `${operatorToken.value}\n${" ".repeat(parent.loc.start.column - 1 > 0 ? parent.loc.start.column - 1 : 0)}`)}
          });
        }
    }

    /**
     * Validates a binary expression using `validateNode`
     * @param {BinaryExpression|LogicalExpression|AssignmentExpression} node node to be validated
     * @returns {void}
     */
    function validateBinaryExpression(node) {
        validateNode(node, node.right, node.operator);
    }

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    return {
        LogicalExpression: validateBinaryExpression,
        AssignmentExpression: validateBinaryExpression,
        VariableDeclarator(node) {
            if (node.init) {
                validateNode(node, node.init, "=");
            }
        },
        PropertyDefinition(node) {
            if (node.value) {
                validateNode(node, node.value, "=");
            }
        },
        ConditionalExpression(node) {
            validateNode(node, node.consequent, "?");
            validateNode(node, node.alternate, ":");
        }
    };
  },
};
