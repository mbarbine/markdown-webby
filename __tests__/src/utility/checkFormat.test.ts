import {
  isWebsiteUrl,
  isColorFormat,
  isImageUrl,
} from "@/src/utility/checkFormat"

describe("isWebsiteUrl", () => {
  it("returns true for https URLs", () => {
    expect(isWebsiteUrl("https://example.com")).toBe(true)
  })

  it("returns true for http URLs", () => {
    expect(isWebsiteUrl("http://example.com")).toBe(true)
  })

  it("returns true for www URLs", () => {
    expect(isWebsiteUrl("www.example.com")).toBe(true)
  })

  it("returns false for plain text", () => {
    expect(isWebsiteUrl("just some text")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isWebsiteUrl("")).toBe(false)
  })

  it("returns true for URLs with paths", () => {
    expect(isWebsiteUrl("https://example.com/path/to/page")).toBe(true)
  })
})

describe("isColorFormat", () => {
  it("returns true for 6-digit hex", () => {
    expect(isColorFormat("#ff0000")).toBe(true)
  })

  it("returns true for 3-digit hex", () => {
    expect(isColorFormat("#f00")).toBe(true)
  })

  it("returns true for rgb format", () => {
    expect(isColorFormat("rgb(255, 0, 0)")).toBe(true)
  })

  it("returns true for rgba format", () => {
    expect(isColorFormat("rgba(255, 0, 0, 0.5)")).toBe(true)
  })

  it("returns false for invalid color", () => {
    expect(isColorFormat("red")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isColorFormat("")).toBe(false)
  })

  it("returns false for invalid hex", () => {
    expect(isColorFormat("#gggggg")).toBe(false)
  })
})

describe("isImageUrl", () => {
  it("returns true for PNG URLs", () => {
    expect(isImageUrl("https://example.com/image.png")).toBe(true)
  })

  it("returns true for JPG URLs", () => {
    expect(isImageUrl("https://example.com/photo.jpg")).toBe(true)
  })

  it("returns true for GIF URLs", () => {
    expect(isImageUrl("https://example.com/anim.gif")).toBe(true)
  })

  it("returns false for non-image URLs", () => {
    expect(isImageUrl("https://example.com/file.pdf")).toBe(false)
  })

  it("returns false for empty string", () => {
    expect(isImageUrl("")).toBe(false)
  })

  it("returns false for plain text", () => {
    expect(isImageUrl("not a url")).toBe(false)
  })
})
