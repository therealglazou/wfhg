/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Original author: Daniel Glazman
 */

class WolframToken {

    // TOKEN TYPES
    static kEOS = 0;
    static kSYMBOL = 1;
    static kIDENT = 2;

    /**
     * CONSTRUCTOR
     */
    constructor(aType, aValue = null) {
        this.mType = aType;
        this.mValue = aValue;
    }

    get value() {
        return this.mValue;
    }

    /**
     * TYPE CHECKS
     */
    isEOS() {
        return this.mType == WolframToken.kEOS;
    }

    isSymbol(aSymbol) {
        return this.mType == WolframToken.kSYMBOL
               && (!aSymbol
                   || this.mValue == aSymbol);
    }

    isIdent(aIdent) {
        return this.mType == WolframToken.kIDENT
               && (!aIdent
                   || this.mValue == aIdent);
    }

    /**
     * FACTORIES
     */
     static newEOS() {
        return new WolframToken(WolframToken.kEOS);
    }

    static newSymbol(aSymbol) {
        return new WolframToken(WolframToken.kSYMBOL, aSymbol);
    }

    static newIdent(aIdent) {
        return new WolframToken(WolframToken.kIDENT, aIdent);
    }
}
