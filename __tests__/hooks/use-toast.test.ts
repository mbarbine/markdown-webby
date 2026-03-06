import { reducer } from "@/hooks/use-toast"

describe("toast reducer", () => {
  const makeToast = (id: string) => ({
    id,
    open: true,
    onOpenChange: () => {},
  })

  it("ADD_TOAST adds a toast", () => {
    const state = { toasts: [] }
    const toast = makeToast("1")
    const result = reducer(state, { type: "ADD_TOAST", toast })
    expect(result.toasts).toHaveLength(1)
    expect(result.toasts[0].id).toBe("1")
  })

  it("ADD_TOAST respects TOAST_LIMIT of 1", () => {
    const state = { toasts: [makeToast("1")] }
    const newToast = makeToast("2")
    const result = reducer(state, { type: "ADD_TOAST", toast: newToast })
    // TOAST_LIMIT is 1, so only newest toast remains
    expect(result.toasts).toHaveLength(1)
    expect(result.toasts[0].id).toBe("2")
  })

  it("UPDATE_TOAST updates matching toast", () => {
    const state = { toasts: [makeToast("1")] }
    const result = reducer(state, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Updated" },
    })
    expect(result.toasts[0].title).toBe("Updated")
  })

  it("UPDATE_TOAST does not affect non-matching toasts", () => {
    const state = { toasts: [makeToast("1"), makeToast("2")] }
    const result = reducer(state, {
      type: "UPDATE_TOAST",
      toast: { id: "1", title: "Updated" },
    })
    expect(result.toasts[1].title).toBeUndefined()
  })

  it("DISMISS_TOAST sets open to false for specific toast", () => {
    const state = { toasts: [makeToast("1")] }
    const result = reducer(state, { type: "DISMISS_TOAST", toastId: "1" })
    expect(result.toasts[0].open).toBe(false)
  })

  it("DISMISS_TOAST without id sets all toasts to closed", () => {
    const state = { toasts: [makeToast("1"), makeToast("2")] }
    const result = reducer(state, { type: "DISMISS_TOAST" })
    result.toasts.forEach((t) => {
      expect(t.open).toBe(false)
    })
  })

  it("REMOVE_TOAST removes a specific toast", () => {
    const state = { toasts: [makeToast("1"), makeToast("2")] }
    const result = reducer(state, { type: "REMOVE_TOAST", toastId: "1" })
    expect(result.toasts).toHaveLength(1)
    expect(result.toasts[0].id).toBe("2")
  })

  it("REMOVE_TOAST without id clears all toasts", () => {
    const state = { toasts: [makeToast("1"), makeToast("2")] }
    const result = reducer(state, { type: "REMOVE_TOAST", toastId: undefined })
    expect(result.toasts).toHaveLength(0)
  })
})
