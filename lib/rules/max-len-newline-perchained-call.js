/**
 * @fileoverview Rule to ensure newline per method call when chaining calls
 * @author Rajendra Patil
 * @author Burak Yigit Kaya
 * @author Dev1437
 */

 "use strict";

 const astUtils = require("./utils/ast-utils");

 //------------------------------------------------------------------------------
 // Rule Definition
 //------------------------------------------------------------------------------

 /**
  * Computes the length of a line that may contain tabs. The width of each
  * tab will be the number of spaces to the next tab stop.
  * @param {string} line The line.
  * @param {int} tabWidth The width of each tab stop in spaces.
  * @returns {int} The computed line length.
  * @private
  */
 function computeLineLength(line, tabWidth) {
     let extraCharacterCount = 0;

     line.replace(/\t/gu, (match, offset) => {
         const totalOffset = offset + extraCharacterCount,
             previousTabStopOffset = tabWidth ? totalOffset % tabWidth : 0,
             spaceCount = tabWidth - previousTabStopOffset;

         extraCharacterCount += spaceCount - 1; // -1 for the replaced tab
     });
     return Array.from(line).length + extraCharacterCount;
 }

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
     meta: {
         type: "layout",

         docs: {
             description: "Require a newline after each call in a method chain",
             recommended: false,
             url: "https://eslint.org/docs/rules/newline-per-chained-call"
         },

         fixable: "whitespace",

         schema: [{
             type: "object",
             properties: {
                 ignoreChainWithDepth: {
                     type: "integer",
                     minimum: 1,
                     maximum: 10,
                     default: 2
                 },
                 maxLen: {
                     type: "integer",
                     default: 0
                 }
             },
             additionalProperties: false
         }],
         messages: {
             expected: "Expected line break before `{{callee}}`."
         }
     },

     create(context) {

         const options = context.options[0] || {},
             ignoreChainWithDepth = options.ignoreChainWithDepth || 2;

         let maxLen = options.maxLen || 0;

         const sourceCode = context.getSourceCode();

         /**
          * Get the prefix of a given MemberExpression node.
          * If the MemberExpression node is a computed value it returns a
          * left bracket. If not it returns a period.
          * @param {ASTNode} node A MemberExpression node to get
          * @returns {string} The prefix of the node.
          */
         function getPrefix(node) {
             if (node.computed) {
                 if (node.optional) {
                     return "?.[";
                 }
                 return "[";
             }
             if (node.optional) {
                 return "?.";
             }
             return ".";
         }

         /**
          * Gets the property text of a given MemberExpression node.
          * If the text is multiline, this returns only the first line.
          * @param {ASTNode} node A MemberExpression node to get.
          * @returns {string} The property text of the node.
          */
         function getPropertyText(node) {
             const prefix = getPrefix(node);
             const lines = sourceCode.getText(node.property).split(astUtils.LINEBREAK_MATCHER);
             const suffix = node.computed && lines.length === 1 ? "]" : "";

             return prefix + lines[0] + suffix;
         }

         return {
             "CallExpression:exit"(node) {
                 const callee = astUtils.skipChainExpression(node.callee);

                 let line = context.getSourceCode().lines[callee.loc.start.line - 1];

                 if (callee.type !== "MemberExpression") {
                     return;
                 }

                 let parent = astUtils.skipChainExpression(callee.object);
                 let depth = 1;

                 while (parent && parent.callee) {
                     depth += 1;
                     parent = astUtils.skipChainExpression(astUtils.skipChainExpression(parent.callee).object);
                 }

                 if ((maxLen && computeLineLength(line) > maxLen) || (depth > ignoreChainWithDepth && astUtils.isTokenOnSameLine(callee.object, callee.property))) {
                     const firstTokenAfterObject = sourceCode.getTokenAfter(callee.object, astUtils.isNotClosingParenToken);

                     context.report({
                         node: callee.property,
                         loc: {
                             start: firstTokenAfterObject.loc.start,
                             end: callee.loc.end
                         },
                         messageId: "expected",
                         data: {
                             callee: getPropertyText(callee)
                         },
                         fix(fixer) {
                             return fixer.insertTextBefore(firstTokenAfterObject, "\n");
                         }
                     });
                 }
             }
         };
     }
 };
