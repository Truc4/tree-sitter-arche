# tree-sitter-arche

A Tree-sitter grammar for the [Arche](https://github.com/Truc4/arche) language.

Provides syntax highlighting and parsing support for `.arche` files in Neovim, Emacs, and other editors that support Tree-sitter.

## Features

- **Complete grammar** for Arche language (worlds, archetypes, procedures, systems, functions)
- **Neovim highlighting** with semantic token groups
- **Scope tracking** for variable binding and reference analysis
- **Automatic indentation** for code blocks
- **References to arche compiler** via git submodule for testing and grammar verification

## Installation

### Neovim (with LazyVim)

See [NEOVIM.md](NEOVIM.md) for detailed setup instructions.

Quick start:
```lua
parser_config.arche = {
  install_info = {
    url = "https://github.com/Truc4/tree-sitter-arche",
    files = { "src/parser.c" },
    requires_generate_from_grammar = true,
  },
  filetype = "arche",
}
```

### Manual Build

Requires: `node >= 14`, `tree-sitter-cli`

```bash
git clone https://github.com/Truc4/tree-sitter-arche
cd tree-sitter-arche

npm install
npm run build
```

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

## Development

The grammar is validated against the arche compiler's grammar and test fixtures in the `arche/` submodule.

Make changes to `grammar.js`, then:

```bash
npm run build     # Generate parser.c from grammar
npm run test      # Run corpus tests
```

Commit `src/parser.c` and all generated files.

## License

MIT

## Author

Curt Reyes
