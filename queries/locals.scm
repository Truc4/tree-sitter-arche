; Scopes
(proc_declaration body: (block) @scope)
(sys_declaration body: (block) @scope)
(func_declaration body: (block) @scope)
(for_statement body: (block) @scope)

; Variable definitions
(let_statement name: (identifier) @definition)
(parameter name: (identifier) @definition)

; Variable references
(identifier) @reference
