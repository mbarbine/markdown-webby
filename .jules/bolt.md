## 2024-03-22 - [ReactFlow + Dagre Recalculation Bottleneck]
**Learning:** Combining React Flow selection/highlight state updates with Dagre graph layouts in a single `useEffect` results in severe re-render performance bottlenecks on large graphs, as O(V+E) graph layout algorithms run on every simple boolean node interaction.
**Action:** Always decouple structural data layout algorithms (using `useMemo` strictly tied to topology changes like collapsed states and spacing) from purely visual state node updates like selection or highlighting. Let `useEffect` map over the cached layout to merely flip the styling bits.

## 2024-10-24 - [API Route Redundant AST Parsing Bottleneck]
**Learning:** API routes performing full document transformations or exports often re-parse the entire markdown string into an AST multiple times (e.g., for `nodes`/`edges`, `outline`, and `stats`), leading to unnecessary 3x O(N) overhead.
**Action:** When working with API routes that build various document derivatives, always parse the AST once and pass the resulting object graph down to the specialized generation functions.

## 2024-10-25 - [Zustand Full Destructuring Re-render Bottleneck]
**Learning:** Extracting state directly from a Zustand store (e.g., `const { viewMode, content } = useMarkdown()`) at the top level of a major component (like `app/editor/page.tsx`) causes the *entire* component tree to re-render whenever *any* unrelated state in the store changes (e.g., hover state, cursor position, scale). This completely nullifies downstream memoization optimizations.
**Action:** Always use `useShallow` from `zustand/react/shallow` when extracting multiple properties from a Zustand store, or use targeted selectors for single properties, to prevent cascading re-renders across the application.
## 2024-05-15 - [Zustand Store Re-render Bottleneck]
**Learning:** Destructuring state directly from a Zustand store hook (e.g., `const { a, b } = useStore()`) without a selector or `useShallow` causes the component to re-render whenever *any* property in the entire store changes, which can be devastating for complex top-level layout components.
**Action:** When extracting multiple properties from a Zustand store, always use `useShallow` from `zustand/react/shallow` to wrap a selector function, ensuring the component only re-renders when the specific properties it uses actually change.
