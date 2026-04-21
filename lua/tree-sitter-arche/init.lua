local M = {}

function M.setup(opts)
  opts = opts or {}
  if opts.parser_path then
    vim.treesitter.language.add("arche", { path = opts.parser_path })
  end
  if opts.enable_highlights ~= false then
    vim.api.nvim_create_autocmd("FileType", {
      pattern = "arche",
      callback = function(ev)
        pcall(vim.treesitter.start, ev.buf, "arche")
      end,
    })
  end
end

return M
