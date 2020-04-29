function doParse() {
    const elt = document.getElementById("hypergraph");
    const resultElt = document.getElementById("result");

    const hypergraphStr = elt.value.trim();
    if (hypergraphStr) {
        document.getElementById("resultArea").removeAttribute("style");
        try {
            const wolframParser = new WolframParser(hypergraphStr);

            resultElt.textContent = serializeWolframMap(wolframParser.mDataSet);
        }
        catch(e) {
            resultElt.textContent = e;
        }
    }
}

function serializeWolframMap(aMap) {
    let rv = "";

    Array.from(aMap.entries())
        .forEach(aEntry => {
            rv += aEntry[0] + ":\n";

            if (aEntry[1].mRel.size) {
                rv += "    related to:\n";
                aEntry[1].mRel.forEach(aWolframNode => {
                    rv += "        " + aWolframNode.mName + "\n";
                });
            }

            if (aEntry[1].mRev.size) {
                rv += "    reverse relation to:\n";
                aEntry[1].mRev.forEach(aWolframNode => {
                    rv += "        " + aWolframNode.mName + "\n";
                });
            }
    });

    return rv;
}
