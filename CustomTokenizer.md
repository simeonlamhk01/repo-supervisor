# Support Custom file format

## 1. Update config in `config/main.json`
- allowedExtensions
- allowPrefixRegex
- ~~disallowedExtensions~~
- excludedPaths

## 2. Add tokenizer for new extension in `src/parser/tokenizer/{ext_type}/index.js`
- this js require to return a string[]

## 3. Update filter config in `config/filters.json`
- for match extension and tokenizer
