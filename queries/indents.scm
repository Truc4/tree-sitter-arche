; Increase indent inside blocks
[
  (world_declaration)
  (archetype_declaration)
  (proc_declaration)
  (sys_declaration)
  (func_declaration)
  (for_statement)
] @indent

; Decrease indent after closing braces
"}" @dedent
"]" @dedent
