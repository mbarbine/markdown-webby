## 2024-03-22 - [ReactFlow + Dagre Recalculation Bottleneck]
**Learning:** Combining React Flow selection/highlight state updates with Dagre graph layouts in a single `useEffect` results in severe re-render performance bottlenecks on large graphs, as O(V+E) graph layout algorithms run on every simple boolean node interaction.
**Action:** Always decouple structural data layout algorithms (using `useMemo` strictly tied to topology changes like collapsed states and spacing) from purely visual state node updates like selection or highlighting. Let `useEffect` map over the cached layout to merely flip the styling bits.

## 2024-10-24 - [API Route Redundant AST Parsing Bottleneck]
**Learning:** API routes performing full document transformations or exports often re-parse the entire markdown string into an AST multiple times (e.g., for `nodes`/`edges`, `outline`, and `stats`), leading to unnecessary 3x O(N) overhead.
**Action:** When working with API routes that build various document derivatives, always parse the AST once and pass the resulting object graph down to the specialized generation functions.

## 2024-10-25 - [Zustand Store Re-render Bottleneck on Root Components]
**Learning:** Extracting state directly from the un-selected Zustand store object (`const { prop } = useStore()`) on a parent component causes the entire subtree to re-render on *any* store update, even unrelated ones like cursor changes.
**Action:** Always extract specific properties using `useShallow` (`useStore(useShallow(state => ({ prop: state.prop })))`) on parent/layout components to tightly scope re-renders to only necessary data changes.
