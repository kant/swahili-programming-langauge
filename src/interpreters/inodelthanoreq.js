const IBase = require("./ibase.js");
const constants = require("../constants.js");

class INodeLThanOrEq extends IBase {
    interpreteNode (node) {
        return this.evaluateNode(node.left) <= this.evaluateNode(node.right) ? constants.KW.KWELI : constants.KW.SIKWELI;
    }
}

module.exports = new INodeLThanOrEq();
