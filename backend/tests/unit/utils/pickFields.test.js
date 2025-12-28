/**
 * Unit Tests for pickFields Utility
 * 
 * Tests the field picking utility function.
 */

const pickFields = require("../../../utils/pickFields");

describe("pickFields - Unit Tests", () => {
  it("should pick only allowed fields", () => {
    const source = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "secret",
      age: 30,
    };
    const allowedFields = ["firstName", "lastName", "email"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
    });
    expect(result.password).toBeUndefined();
    expect(result.age).toBeUndefined();
  });

  it("should handle missing fields gracefully", () => {
    const source = {
      firstName: "John",
      email: "john@example.com",
    };
    const allowedFields = ["firstName", "lastName", "email"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({
      firstName: "John",
      email: "john@example.com",
    });
    expect(result.lastName).toBeUndefined();
  });

  it("should return empty object when no fields match", () => {
    const source = {
      firstName: "John",
      lastName: "Doe",
    };
    const allowedFields = ["email", "phone"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({});
  });

  it("should handle undefined values", () => {
    const source = {
      firstName: "John",
      lastName: undefined,
      email: "john@example.com",
    };
    const allowedFields = ["firstName", "lastName", "email"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({
      firstName: "John",
      lastName: undefined,
      email: "john@example.com",
    });
  });

  it("should handle null values", () => {
    const source = {
      firstName: "John",
      lastName: null,
    };
    const allowedFields = ["firstName", "lastName"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({
      firstName: "John",
      lastName: null,
    });
  });

  it("should handle empty source object", () => {
    const source = {};
    const allowedFields = ["firstName", "lastName"];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({});
  });

  it("should handle empty allowed fields array", () => {
    const source = {
      firstName: "John",
      lastName: "Doe",
    };
    const allowedFields = [];

    const result = pickFields(source, allowedFields);

    expect(result).toEqual({});
  });
});

