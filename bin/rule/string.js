"use strict";

const { STRING_TYPE } = require("../types"),
      { isStringStringLiteral } = require("../utilities/literal"),
      { addDoubleQuotes, removeDoubleQuotes, addTrailingForwardSlash, removeTrailingForwardSlash } = require("../utilities/string");

class StringRule {
  constructor(string) {
    this.string = string;
  }

  getString() {
    return this.string;
  }

  toJSON() {
    const type = STRING_TYPE,
          string = this.string,
          json = {
            type,
            string
          };

    return json;
  }

  match(string) {
    this.string = removeDoubleQuotes(this.string);  ///

    const matches = (this.string === string);

    this.string = addDoubleQuotes(this.string); ///

    return matches;
  }

  asString() {
    return this.string;
  }

  static fromJSON(json) {
    let stringRule = null;

    const { type } = json;

    if (type === STRING_TYPE) {
      const { string } = json;

      stringRule = new StringRule(string);
    }

    return stringRule;
  }

  static fromStringAndDirectory(string, directory) {
    let stringRule = null;

    string = stringFromStringAndDirectory(string, directory); ///

    if (string !== null) {
      stringRule = new StringRule(string);
    }

    return stringRule;
  }
}

module.exports = StringRule;

function stringFromStringAndDirectory(string, directory) {
  const stringStringLiteral = isStringStringLiteral(string);

  if (stringStringLiteral) {
    const stringLiteral = string; ///

    string = removeDoubleQuotes(stringLiteral);  ///

    string = removeTrailingForwardSlash(string);  ///

    if (directory) {
      string = addTrailingForwardSlash(string); ///
    }

    string = addDoubleQuotes(string); ///
  } else {
    string = null;
  }

  return string;
}
