import { classNames } from "@/src/utility/classNames"

describe("classNames", () => {
  it("joins multiple class names", () => {
    expect(classNames("foo", "bar", "baz")).toBe("foo bar baz")
  })

  it("filters out empty strings", () => {
    expect(classNames("foo", "", "bar")).toBe("foo bar")
  })

  it("returns empty string when no classes", () => {
    expect(classNames()).toBe("")
  })

  it("handles single class", () => {
    expect(classNames("only")).toBe("only")
  })
})
