jest.mock("fs", () => ({
    readFileSync: jest.fn(),
}));

const kwNodeIse = require("../../../parsers/keywordnodes/kwnodeise.js");
const Parser = require("../../../parsers/parser.js");
const lexer = require("../../../lexer.js");
const InputStream = require("../../../inputstream.js");
const constants = require("../../../constants.js");

describe("KwNodeIse test suite", () => {
    let parser;

    beforeEach(() => {
        parser = new Parser(new lexer(new InputStream()));
    });

    test("it should return valid ise node", () => {
        parser.lexer().inputStream.code = `${constants.KW.KAZI} teOruko(a,b) {}`;

        const expectedNode = {
            body: [],
            name: "teOruko",
            operation: constants.KW.KAZI,
            paramTokens: [
                {
                    type: constants.VARIABLE,
                    value: "a",
                },
                {
                    type: constants.VARIABLE,
                    value: "b",
                },
            ],
        };

        expect(kwNodeIse.getNode.call(parser)).toEqual(expectedNode);
    });

    test("it should return valid ise node for nested blocks", () => {
        parser.lexer().inputStream.code = `${constants.KW.KAZI} koOruko(orukoMi) {
            ${constants.KW.HIFADHI} oruko = orukoMi;
            
            ${constants.KW.HAKIKA} (${constants.KW.HIFADHI} i =0; i < 10; ${constants.KW.HIFADHI} i = i + 1) {
                ${constants.KW.ANDIKA} i;
            }
        
            ${constants.KW.KAZI} teAkori() {
                ${constants.KW.ANDIKA} "adupe";
            }
        
            ${constants.KW.PADA} teAkori();
        }`;

        expect(kwNodeIse.getNode.call(parser)).toBeTruthy();
    });

    test("it should fail to create an ise node within an invalid block", () => {
        parser.lexer().inputStream.code = `${constants.KW.KAZI} koOruko(orukoMi) {
            ${constants.KW.HIFADHI} oruko = orukoMi;
            
            ${constants.KW.HAKIKA} (tí i =0; i < 10; tí i = i + 1;) {
                ${constants.KW.ANDIKA} i;

                ${constants.KW.KAZI} teAkori() {
                    ${constants.KW.ANDIKA} "adupe";
                }
            }
        
            ${constants.KW.PADA} teAkori();
        }`;

        expect(() => kwNodeIse.getNode.call(parser)).toThrow();
    });

    test("it should throw an error when given invalid ise", () => {
        parser.lexer().inputStream.code = `${constants.KW.KAZI} (teOruko(a,b) {}`;

        expect(() => {
            kwNodeIse.getNode.call(parser);
        }).toThrow();
    });
});
