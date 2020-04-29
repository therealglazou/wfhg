/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * Original author: Daniel Glazman
 */

class WolframErrorManager {

    constructor() {
        this.mModule = this.constructor.name;
        console.log("### " + this.mModule)
    }

    throw(aCaller, aError) {
        throw new Error(
            this.mModule + "::"
            + aCaller + ": "
            + aError
        );
    }
}
