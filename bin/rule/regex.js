"use strict";

const Occurrence = require("../occurrence");

const { REGEX_TYPE } = require("../types"),
      { isStringRegexLiteral } = require("../utilities/literal"),
      { addAnchors,
        removeAnchors,
        addForwardSlashes,
        removeForwardSlashes,
        addTrailingEscapedForwardSlash,
        removeTrailingEscapedForwardSlash } = require("../utilities/string");

class RegexRule {
  constructor(pattern, regExp) {
    this.pattern = pattern;
    this.regExp = regExp;
  }

  getPattern() {
    return this.pattern;
  }

  getRegExp() {
    return this.regExp;
  }

  toJSON() {
    const type = REGEX_TYPE,
          pattern = this.pattern,
          json = {
            type,
            pattern
          };

    return json;
  }

  find(line) {
    const occurrences = [],
          content = line.getContent();

    let offset = 0,
        string = content, ///
        result = string.match(this.regExp);

    while (result !== null) {
      const occurrence = Occurrence.fromResultAndOffset(result, offset),
            end = occurrence.getEnd(),
            start = end;  ///

      string = string.substring(start); ///

      offset += start;

      occurrences.push(occurrence);

      result = string.match(this.regExp);
    }

    return occurrences;
  }

  match(string) {
    const matches = this.regExp.test(string);

    return matches;
  }

  asString() {
    const string = addForwardSlashes(this.pattern);  ///

    return string;
  }

  static fromJSON(json) {
    let regexRule = null;

    const { type } = json;

    if (type === REGEX_TYPE) {
      const { pattern } = json,
            regExp = new RegExp(pattern);

      regexRule = new RegexRule(pattern, regExp);
    }

    return regexRule;
  }

  static fromStringAnchoredAndDirectory(string, anchored, directory) {
    let regexRule = null;

    const pattern = patternFromStringAndDirectory(string, anchored, directory);

    if (pattern !== null) {
      const regExp = new RegExp(pattern);

      regexRule = new RegexRule(pattern, regExp);
    }

    return regexRule;
  }
}

module.exports = RegexRule;

function patternFromStringAndDirectory(string, anchored, directory) {
  let pattern;

  const stringRegexLiteral = isStringRegexLiteral(string);

  if (stringRegexLiteral) {
    const regexLiteral = string;  ///

    pattern = removeForwardSlashes(regexLiteral);

    pattern = removeAnchors(pattern); ///

    pattern = removeTrailingEscapedForwardSlash(pattern);  ///

    if (directory) {
      pattern = addTrailingEscapedForwardSlash(pattern); ///
    }

    if (anchored) {
      pattern = addAnchors(pattern);
    }

    try {
      new RegExp(pattern);
    } catch (error) {
      pattern = null;
    }
  } else {
    pattern = null;
  }

  return pattern;
}

