## 2024-03-22 - [ReactFlow + Dagre Recalculation Bottleneck]
**Learning:** Combining React Flow selection/highlight state updates with Dagre graph layouts in a single `useEffect` results in severe re-render performance bottlenecks on large graphs, as O(V+E) graph layout algorithms run on every simple boolean node interaction.
**Action:** Always decouple structural data layout algorithms (using `useMemo` strictly tied to topology changes like collapsed states and spacing) from purely visual state node updates like selection or highlighting. Let `useEffect` map over the cached layout to merely flip the styling bits.

## 2024-10-24 - [API Route Redundant AST Parsing Bottleneck]
**Learning:** API routes performing full document transformations or exports often re-parse the entire markdown string into an AST multiple times (e.g., for `nodes`/`edges`, `outline`, and `stats`), leading to unnecessary 3x O(N) overhead.
**Action:** When working with API routes that build various document derivatives, always parse the AST once and pass the resulting object graph down to the specialized generation functions.
## 2024-11-20 - [Zustand Default Store Destructuring Bottleneck]
**Learning:** Destructuring multiple properties directly from a Zustand store hook (e.g., `const { a, b } = useStore()`) causes the component to re-render whenever *any* state in the store changes, even properties the component doesn't use. This is especially problematic in top-level layout components (like `EditorPage`) when the store handles high-frequency state updates like mouse positions or hover IDs.
**Action:** Always wrap the selector function in `useShallow` from `zustand/react/shallow` when extracting multiple properties from a Zustand store. E.g., `useStore(useShallow(state => ({ a: state.a, b: state.b })))`.
