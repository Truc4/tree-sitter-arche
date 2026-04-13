# Neovim Integration

This grammar is designed to work with nvim-treesitter for syntax highlighting and other tree-based features in Neovim.

## LazyVim Setup

Add the following to your LazyVim configuration (e.g., in `~/.config/nvim/lua/config/lazy.lua` or a custom plugin spec):

```lua
{
  "nvim-treesitter/nvim-treesitter",
  opts = function(_, opts)
    -- Register the arche parser
    local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
    
    parser_config.arche = {
      install_info = {
        url = "https://github.com/Truc4/tree-sitter-arche",
        files = { "src/parser.c" },
        branch = "main",
        requires_generate_from_grammar = true,
      },
      filetype = "arche",
      used_by = { "arche" },
    }

    -- Add to ensure_installed list
    if opts.ensure_installed then
      table.insert(opts.ensure_installed, "arche")
    end

    return opts
  end,
}
```

## Filetype Setup

Add to your nvim config to recognize `.arche` files:

```lua
vim.filetype.add({
  extension = {
    arche = "arche",
  },
})
```

Or in init.vim:
```vim
autocmd BufRead,BufNewFile *.arche setfiletype arche
```

## Manual Installation

If you prefer to manually install the parser:

```bash
cd ~/.local/share/nvim/site/pack/packer/start/nvim-treesitter
git clone https://github.com/Truc4/tree-sitter-arche parsers/arche

cd parsers/arche
npm install
npm run build
```

Then add to nvim config:
```lua
vim.treesitter.language.register("arche", "arche")
```

## Features

Once installed, you get:
- **Syntax highlighting** — colors for keywords, types, variables, etc.
- **Indentation** — automatic indentation in blocks
- **Code folding** — fold blocks with `zf`
- **Motions** — navigate with tree-sitter aware motions (if configured)

## Troubleshooting

If highlighting isn't working:
1. Check `:set filetype` returns `arche`
2. Verify parser installed: `:TSInstallInfo arche`
3. Check highlights applied: `:Inspect` on a token

## Local Development

For development of the grammar, clone the repo and use:

```bash
npm install
npm run build
npm run test
```

Then symlink to nvim's parser directory:
```bash
ln -s $(pwd) ~/.local/share/nvim/site/pack/packer/start/nvim-treesitter/parsers/arche
```
