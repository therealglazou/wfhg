/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Original author: Daniel Glazman
 */

 /**
  * Wolfram hypergraph parser
  */
class WolframParser extends WolframErrorManager {

    kEXPECTED_OPEN_CURLY_BRACE_ERROR = "error, expected an opening curly brace";
    kEXPECTED_IDENT_ERROR            = "error, expected an identifier";
    kEXPECTED_COMMA_ERROR            = "error, expected a comma";
    kEXPECTED_COMMA_OR_CLOSE_CURLY_BRACE_ERROR = "error, expected a comma or a closing curly brace";
    kEXPECTED_COMMA_OR_OPEN_CURLY_BRACE_ERROR  = "error, expected a comma or an opening curly brace";
    kSYNTAX_ERROR                    = "syntax error";

    /**
     * CONSTRUCTOR
     *
     * @param {string} aString - the string to parse
     */
    constructor(aString) {
        super("WolframParser");

        this.mDataSet = new Map();

        if (typeof aString == "string") {
            const str = aString.trim();
            if (str) {
                this._parse(str);
            }
        }

        console.log(this.mDataSet);
    }

    /**
     * Public getter for the parsed result
     */
    get dataSet() {
        return this.mDataSet;
    }

    /**
     * Gathers an identifier made of letters or digits
     *
     * @param {string} aChar - one character
     * @returns {string}
     */
    _gatherIdent(aChar) {
        let rv = "";
        while (this.mCurrentPos < this.mStringLength) {
            const c = this.mString[this.mCurrentPos];
            if (c.match( /[0-9a-zA-Z]/ )) {
                rv += c;
                this.mCurrentPos++;
            }
            else {
                break;
            }
        }
        return rv;
    }

    /**
     * Tokenizer
     */
    _getToken() {
        let rv = null;
        do {
            if (this.mCurrentPos >= this.mStringLength) {
                return WolframToken.newEOS();
            }

            const c = this.mString[this.mCurrentPos];
            switch (c.trim()) {
                case "{":
                case "}":
                case ",":
                    rv = WolframToken.newSymbol(c);
                    this.mCurrentPos++;
                    break;

                case "": // white-space, iterate
                    this.mCurrentPos++;
                    continue;

                default: break;
            }

            if (!rv) {
                if (c.match( /[0-9a-zA-Z]/ )) {
                    const ident = this._gatherIdent();
                    rv = WolframToken.newIdent(ident);
                }
                else {
                    this.throw(
                        "_parse",
                        "invalid character at position " + this.mCurrentPos
                    );
                }
            }
        } while (!rv);

        return rv;
    }

    /**
     * Parse a string into the resulting dataset map
     *
     * @param {string} aString 
     */
    _parse(aString) {
        // a few basic inits
        this.mString = aString;
        this.mStringLength = this.mString.length;
        this.mCurrentPos = 0;

        // get the first token
        let token = this._getToken();
        if (token.isSymbol("{")) {
            // must be a curly brace
            token = this._getToken();
        }
        else {
            this.throw(
                "_parse",
                this.kEXPECTED_OPEN_CURLY_BRACE_ERROR
            );
        }

        // loop until we hit the end of the string
        while (!token.isEOS()) {

            // currentNode will hold the source of an oriented graoh relation
            let currentNode = null;

            // iterate over the relations
            while (true) {
                // are we opening a new set of relations?
                if (!currentNode) {
                    if (!token.isSymbol("{")) {
                        // not a curly brace, let's throw
                        this.throw(
                            "_parse",
                            this.kEXPECTED_OPEN_CURLY_BRACE_ERROR
                        );
                    }

                    // capture next token
                    token = this._getToken();
                }

                // next token should be an identifier
                if (!token.isIdent()) {
                    this.throw(
                        "_parse",
                        this.kEXPECTED_IDENT_ERROR
                    );
                }

                let newNode = null;
                if (this.mDataSet.has(token.value)) {
                    // retrieve from the dataset if already created...
                    newNode = this.mDataSet.get(token.value);
                }
                else {
                    // ...or add to the dataset if not
                    newNode = new WolframNode(token.value);
                    this.mDataSet.set(token.value, newNode);
                }

                if (currentNode) {
                    // if we have two nodes, link them
                    currentNode.addRelationship(newNode);
                    newNode.addReverseRelationship(currentNode);
                }

                // do we have another relationship in the vector?
                token = this._getToken();
                if (!currentNode
                    && !token.isSymbol(",")) {
                    this.throw(
                        "_parse",
                        this.kEXPECTED_COMMA_ERROR
                    );
                }

                if (token.isSymbol(",")) {
                    // yes we do, let's shift
                    currentNode = newNode;
                    token = this._getToken();
                }
                else if (token.isSymbol("}")) {
                    // no we don't, close that vector
                    token = this._getToken();
                    break;
                }
                else {
                    this.throw(
                        "_parse",
                        this.kEXPECTED_COMMA_OR_CLOSE_CURLY_BRACE_ERROR
                    );
                }
            }

            if (token.isSymbol("}")) {
                token = this._getToken();
                break;
            }
            else if (token.isSymbol(",")) {
                token = this._getToken();
            }
            else {
                this.throw(
                    "_parse",
                    this.kEXPECTED_COMMA_OR_CLOSE_CURLY_BRACE_ERROR
                );
            }            
        }

        if (!token.isEOS()) {
            this.throw(
                "_parse",
                this.kSYNTAX_ERROR
            );
        }
    }
}