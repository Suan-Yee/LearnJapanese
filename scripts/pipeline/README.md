# Advanced Data Pipeline

This pipeline builds normalized study data and SRS-ready review seeds from local source files and optional external corpora.

## Run All

```bash
npm run pipeline:run
```

This executes importers, normalization, lesson building, review seed generation, and validation.

## Validation Test

```bash
npm run pipeline:test
```

## Output Files

- `data/processed/imports/jmdict.json`
- `data/processed/imports/kanjidic.json`
- `data/processed/imports/tatoeba.json`
- `data/processed/normalized.core.json`
- `data/processed/lesson-plan.json`
- `data/processed/review-seeds.json`
- mirrored copies in `src/data/` for app consumption

## Raw Inputs

Core local inputs:
- `src/json/vocab.json`
- `src/json/kanji.json`
- `src/json/kanji_n4.json`

Optional external corpora (drop in `data/raw/`):
- `JMdict_e.xml`
- `kanjidic2.xml`
- `tatoeba.jpn-eng.tsv` (tab format: `jp\ten\tmy`)

If raw corpora are missing, corresponding import steps are skipped gracefully.

## Stages

1. `import-jmdict.mjs`
2. `import-kanjidic.mjs`
3. `import-tatoeba.mjs`
4. `build-normalized.mjs`
5. `build-lessons.mjs`
6. `build-review-seeds.mjs`
7. `validate-pipeline.mjs`

## Notes

- Scripts are dependency-free Node ESM.
- IDs are hash-based and deterministic across runs.
- Validation checks referential integrity and seed counts.
