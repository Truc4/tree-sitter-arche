# tree-sitter-arche

A Tree-sitter grammar for the [Arche](https://github.com/Truc4/arche) language.

Provides syntax highlighting and parsing support for `.arche` files in Neovim, Emacs, and other editors that support Tree-sitter.

## Features

- **Complete grammar** for Arche language (worlds, archetypes, procedures, systems, functions)
- **Neovim highlighting** with semantic token groups
- **Scope tracking** for variable binding and reference analysis
- **Automatic indentation** for code blocks
- **References to arche compiler** via git submodule for testing and grammar verification

## Quickstart

### LazyVim

Add to your LazyVim config:

```lua
{
  "nvim-treesitter/nvim-treesitter",
  opts = function(_, opts)
    local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
    parser_config.arche = {
      install_info = {
        url = "https://github.com/Truc4/tree-sitter-arche",
        files = { "src/parser.c" },
        requires_generate_from_grammar = true,
      },
      filetype = "arche",
    }
    if opts.ensure_installed then
      table.insert(opts.ensure_installed, "arche")
    end
    return opts
  end,
}
```

Also add filetype detection (in your config or init.vim):
```lua
vim.filetype.add({
  extension = { arche = "arche" },
})
```

Then run `:TSInstall arche` and open a `.arche` file. Done.

### Manual Installation

Requires: `node >= 14`, `tree-sitter-cli` npm.

```bash
git clone https://github.com/Truc4/tree-sitter-arche
cd tree-sitter-arche

npm install
npm run build

# Symlink to nvim (adjust path if needed)
ln -s $(pwd) ~/.local/share/nvim/site/pack/packer/start/nvim-treesitter/parsers/arche

# Then in nvim config:
# vim.treesitter.language.register("arche", "arche")
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

## License

MIT

## Author

Curt Reyes
