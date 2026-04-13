# tree-sitter-arche

A Tree-sitter grammar for the [Arche](https://github.com/Truc4/arche) language.

Provides syntax highlighting and parsing support for `.arche` files in Neovim, Emacs, and other editors that support Tree-sitter.

## Features

- **Complete grammar** for Arche language (worlds, archetypes, procedures, systems, functions)
- **Neovim highlighting** with semantic token groups
- **Scope tracking** for variable binding and reference analysis
- **Automatic indentation** for code blocks
- **References to arche compiler** via git submodule for testing and grammar verification

## Setup

### LazyVim

Add to your plugins (e.g., `lua/plugins/treesitter.lua`):

```lua
{
  "Truc4/tree-sitter-arche",
  dependencies = "nvim-treesitter/nvim-treesitter"
}
```

LazyVim automatically clones, builds, and registers the parser. Open a `.arche` file and syntax highlighting works.

## Testing

Run test suite:
```bash
npm test
```

## Project Structure

```
.
├── grammar.js              # Tree-sitter grammar definition
├── package.json            # npm configuration
├── queries/
│   ├── highlights.scm      # Syntax highlighting rules
│   ├── locals.scm          # Scope and variable tracking
│   └── indents.scm         # Indentation rules
├── test/
│   └── corpus/             # Test cases
├── src/                    # Generated parser (created by tree-sitter generate)
└── arche/                  # Git submodule: reference compiler + test fixtures
```

## Language Reference

**Declarations:**
- `world` — declare a world with optional fields
- `arche` / `archetype` — declare an archetype with meta and column fields
- `proc` — procedure with statements
- `sys` — system with parameters and statements
- `func` — function with typed return
- `extern proc` — external procedure declaration

**Statements:**
- `let` — variable binding
- Assignment: `=`, `+=`, `-=`, `*=`, `/=`
- `for...in` — iteration
- `run...in` — system execution
- `free` — deallocation

**Expressions:**
- Literals: numbers, strings
- Identifiers and field access (`obj.field`)
- Indexing (`arr[i, j]`)
- Binary operators: `+`, `-`, `*`, `/`, `==`, `!=`, `<`, `>`, `<=`, `>=`
- Unary: `-`, `!`
- Function calls: `func(args)`
- Allocation: `Entity.alloc(field: value)`

See [arche/docs/GRAMMAR.peg](arche/docs/GRAMMAR.peg) for full grammar specification.

## Troubleshooting

**Parser fails to install:**
- Make sure `requires_generate_from_grammar` is **not** set (tree-sitter-cli generates on your machine, not from grammar.js)
- Check `:TSCheckHealth` for errors

**Highlighting not working:**
- Verify filetype: `:set filetype?` should show `arche`
- Check parser loaded: `:TSInstallInfo arche` should show status
- Verify highlights loaded: `:set filetype=arche` then `:Inspect` on a keyword

**"arche" is not a valid language:**
- Parser not installed. Run `:TSInstall arche`
- Or restart nvim after installing

## Development

The grammar (`grammar.js`) is derived from [`arche/docs/GRAMMAR.peg`](arche/docs/GRAMMAR.peg). The `arche/` submodule contains reference compiler, test fixtures, and the canonical grammar spec.

To modify the grammar:

```bash
# Edit grammar.js
vim grammar.js

# Regenerate parser.c
npm run build

# Test (optional, corpus tests TBD)
npm test
```

After changes, commit `grammar.js` and the generated files in `src/`.
