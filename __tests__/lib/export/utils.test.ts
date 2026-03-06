import { formatFileSize } from "@/lib/export/utils"

describe("formatFileSize", () => {
  it("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B")
  })

  it("formats kilobytes", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB")
  })

  it("formats megabytes", () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe("2.0 MB")
  })

  it("formats 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B")
  })

  it("formats exactly 1024 bytes as KB", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB")
  })

  it("formats exactly 1 MB", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB")
  })
})
