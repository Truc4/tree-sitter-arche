; Keywords
[
  "world"
  "arche"
  "archetype"
  "proc"
  "sys"
  "func"
  "let"
  "for"
  "in"
  "run"
  "free"
  "extern"
] @keyword

; Field modifiers
["meta" "col"] @keyword.modifier

; Declarations
(world_declaration name: (identifier) @namespace)
(archetype_declaration name: (identifier) @type.definition)
(proc_declaration name: (identifier) @function)
(sys_declaration name: (identifier) @function)
(func_declaration name: (identifier) @function)
(extern_declaration name: (identifier) @function)

; Function calls
(call_expression function: (identifier) @function.call)

; Type annotations
(type) @type
(parameter name: (identifier) @variable.parameter)

; Field and property access
(field_expression field: (identifier) @property)
(field_declaration name: (identifier) @property)
(field_init name: (identifier) @property)

; Let bindings
(let_statement name: (identifier) @variable)

; Literals
(number_literal) @number
(string_literal) @string

; Comments
(comment) @comment

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "="
  "+="
  "-="
  "*="
  "/="
  "->"
] @operator

; Unary operators
(unary_expression operator: _ @operator)

; Punctuation
["(" ")" "{" "}" "[" "]"] @punctuation.bracket
["." "," ":" ";"] @punctuation.delimiter
