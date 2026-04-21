if vim.g.loaded_tree_sitter_arche then return end
vim.g.loaded_tree_sitter_arche = true

local plugin_root = vim.fn.fnamemodify(debug.getinfo(1, "S").source:sub(2), ":h:h")
local parser_path = plugin_root .. "/parser/arche.so"

local ok, err = pcall(vim.treesitter.language.add, "arche", { path = parser_path })
if not ok then
  vim.notify("tree-sitter-arche: failed to load parser: " .. tostring(err), vim.log.levels.WARN)
  return
end

vim.treesitter.language.register("arche", "arche")

-- Optional nvim-treesitter integration
local has_ts, ts_parsers = pcall(require, "nvim-treesitter.parsers")
if has_ts and ts_parsers.get_parser_configs then
  ts_parsers.get_parser_configs().arche = {
    install_info = {
      url = "https://github.com/Truc4/tree-sitter-arche",
      files = { "src/parser.c" },
      branch = "master",
    },
    filetype = "arche",
  }
end
