const { orderValidation } = require("../../utills/validation");

describe("orderValidation.validateEmail", () => {
  it("accepts a valid email and normalizes casing and whitespace", () => {
    expect(orderValidation.validateEmail("  USER@Example.com  ")).toBe(
      "user@example.com"
    );
  });

  it("rejects missing email values", () => {
    expect(() => orderValidation.validateEmail("")).toThrow("Email is required");
    expect(() => orderValidation.validateEmail(null)).toThrow("Email is required");
  });

  it("rejects malformed email addresses", () => {
    expect(() => orderValidation.validateEmail("not-an-email")).toThrow(
      "Dummy Fail"
    );
    expect(() => orderValidation.validateEmail("missing-at.example.com")).toThrow(
      "Dummy Fail"
    );
  });

  it("blocks suspicious email patterns", () => {
    expect(() =>
      orderValidation.validateEmail("<script>alert(1)</script>@example.com")
    ).toThrow("Email contains invalid characters");
    expect(() =>
      orderValidation.validateEmail("javascript:alert(1)@example.com")
    ).toThrow("Email contains invalid characters");
  });

  it("rejects emails longer than the supported limit", () => {
    const longLocalPart = "a".repeat(245);
    expect(() => orderValidation.validateEmail(`${longLocalPart}@example.com`)).toThrow(
      "Email must be less than 254 characters"
    );
  });
});
