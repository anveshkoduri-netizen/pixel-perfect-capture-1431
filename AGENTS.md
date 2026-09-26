<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Catalogue, categories and category-aware filter definitions live in `src/lib/skycart-data.ts`; keep them in one module so pages stay presentational.
- Cart, wishlist, saved and recently-viewed state lives in `src/lib/cart.tsx` (React context + localStorage) — no backend yet, so all commerce state flows through that provider.
- Shared SKYCART UI (header, bottom nav, product card, filters, results view, primitives) lives in `src/components/skycart/`; pages compose these instead of defining one-off styles.
