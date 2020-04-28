/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Original author: Daniel Glazman
 */

 /**
  * Class for graph nodes and oriented relationships
  */
class WolframNode extends WolframErrorManager {

    constructor(aIdent) {
        super("WolframNode");

        this.mName = aIdent;
        // relationships
        this.mRel = new Set();
        // reverse relationships
        this.mRev = new Set();
    }

    addRelationship(aIdent) {
        if (this.mRel.has(aIdent)) {
            this.throw("addRelationship",
                "relationship already exists: "
                    + this.mName + " (rel) " + aIdent);
        }

        this.mRel.add(aIdent);
    }

    addReverseRelationship(aIdent) {
        if (this.mRev.has(aIdent)) {
            this.throw("addReverseRelationship",
                "reverse relationship already exists: "
                    + this.mName + " (rev) " + aIdent);
        }

        this.mRev.add(aIdent);
    }
}
