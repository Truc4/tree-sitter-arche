; Keywords
[
  "arche"
  "proc"
  "sys"
  "func"
  "let"
  "for"
  "in"
  "free"
  "extern"
  "world"
] @keyword

; alloc and run are identifiers in the language — highlight as keywords contextually
(alloc_expression "alloc" @keyword)
(run_statement "run" @keyword)

; Declarations
(world_declaration name: (identifier) @namespace)
(archetype_declaration name: (identifier) @type.definition)
(proc_declaration name: (identifier) @function)
(sys_declaration name: (identifier) @function)
(func_declaration name: (identifier) @function)
(extern_declaration name: (identifier) @function)

; Calls
(call_expression function: (identifier) @function.call)
(call_expression function: (field_expression field: (identifier) @method.call))

; Alloc type
(alloc_expression type: (identifier) @type)

; Types
(type) @type
(parameter name: (identifier) @variable.parameter)

; Field access and properties
(field_expression field: (identifier) @property)
(field_declaration name: (identifier) @property)

; Variable bindings
(let_statement name: (identifier) @variable)

; Literals
(number_literal) @number
(string_literal) @string

; Comments
(comment) @comment

; Operators
[
  "+" "-" "*" "/" "==" "!=" "<" ">" "<=" ">="
  "=" "+=" "-=" "*=" "/=" "->"
] @operator

(unary_expression operator: _ @operator)

; Punctuation
["(" ")" "{" "}" "[" "]"] @punctuation.bracket
["." "," ":" ";"] @punctuation.delimiter
