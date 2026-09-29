# ruvra — tema de Shopify

Tema propio de la tienda ruvra. Base: **Dawn 16.0.0** (Shopify, licencia en `LICENSE.md`).
Diseño de referencia: `../../ruvra-handoff/disenos/shopify-home-*.html`.

## Trabajo local

```bash
shopify theme dev --store TIENDA.myshopify.com   # vista previa local con recarga en vivo
shopify theme check                              # lint (Dawn base: 0 errores, 9 warnings)
shopify theme push --unpublished                 # subir como tema no publicado
```

## Convenciones

- Todo lo propio lleva prefijo `ruvra-` (secciones, snippets, assets) para separarlo de Dawn.
- Tipografía: `assets/geist-latin.woff2` (Geist variable 400–700, subset latin, OFL). Sin Google Fonts en runtime.
- Colores y radios: tokens en `assets/ruvra.css`, tomados del README del handoff.
