import etapiUtils = require("./etapi_utils");
const EtapiError = etapiUtils.EtapiError;

describe("EtapiError", () => {
    it("should support instanceof", () => {
        const anError = new etapiUtils.EtapiError(404, "123", "test");
        expect(anError instanceof EtapiError).toBeTruthy();
        expect(anError instanceof Error).toBeTruthy();
        expect(new Error("Test") instanceof EtapiError).toBeFalsy();
        anError.foo();
    });
});