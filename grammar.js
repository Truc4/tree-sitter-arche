module.exports = grammar({
  name: 'arche',

  word: $ => $.identifier,

  extras: $ => [
    /\s+/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._declaration),

    _declaration: $ => choice(
      $.world_declaration,
      $.archetype_declaration,
      $.proc_declaration,
      $.sys_declaration,
      $.func_declaration,
      $.extern_declaration,
    ),

    // world Game() or world Game(field1, field2, ...)
    world_declaration: $ => seq(
      'world',
      $.identifier,
      '(',
      optional(commaSep($.identifier)),
      ')',
    ),

    // arche Player { meta field: Type, col field: Type }
    // or archetype Player { ... }
    archetype_declaration: $ => seq(
      choice('arche', 'archetype'),
      $.identifier,
      '{',
      repeat($.field_declaration),
      '}',
    ),

    // meta position: Vec3,  or  col health: Float
    field_declaration: $ => seq(
      choice('meta', 'col'),
      $.identifier,
      ':',
      $.type,
      optional(','),
    ),

    // proc init() { ... }
    // proc move(pos, vel) { ... }
    proc_declaration: $ => seq(
      'proc',
      $.identifier,
      '(',
      optional(commaSep($._proc_parameter)),
      ')',
      '{',
      repeat($._statement),
      '}',
    ),

    // For proc, parameters can be bare identifiers (no type) or name: type
    _proc_parameter: $ => choice(
      $.parameter,
      $.identifier,
    ),

    // sys move(pos, vel) { ... }
    sys_declaration: $ => seq(
      'sys',
      $.identifier,
      '(',
      optional(commaSep($._proc_parameter)),
      ')',
      '{',
      repeat($._statement),
      '}',
    ),

    // func clamp(value: Float, ...) -> Float { expr }
    func_declaration: $ => seq(
      'func',
      $.identifier,
      '(',
      optional(commaSep($.parameter)),
      ')',
      '->',
      $.type,
      '{',
      $._expression,
      '}',
    ),

    // extern proc write(fd: Int, buf: Str, len: Int);
    extern_declaration: $ => seq(
      'extern',
      'proc',
      $.identifier,
      '(',
      optional(commaSep($.parameter)),
      ')',
      ';',
    ),

    // name: Type
    parameter: $ => seq(
      $.identifier,
      ':',
      $.type,
    ),

    // Type is just an identifier (Int, Float, Vec3, etc.)
    type: $ => $.identifier,

    // Statements
    _statement: $ => choice(
      $.let_statement,
      $.assignment_statement,
      $.for_statement,
      $.run_statement,
      $.free_statement,
      $.expression_statement,
      $.empty_statement,
    ),

    // let x = 10;
    let_statement: $ => seq(
      'let',
      $.identifier,
      '=',
      $._expression,
      ';',
    ),

    // pos = pos + vel;  or  x += 5;
    assignment_statement: $ => seq(
      $._assignable,
      $.assign_op,
      $._expression,
      ';',
    ),

    assign_op: $ => choice('=', '+=', '-=', '*=', '/='),

    // for i in players { ... }
    for_statement: $ => seq(
      'for',
      $.identifier,
      'in',
      $.identifier,
      '{',
      repeat($._statement),
      '}',
    ),

    // run move in GameWorld;
    run_statement: $ => seq(
      'run',
      $.identifier,
      'in',
      $.identifier,
      ';',
    ),

    // free instance;
    free_statement: $ => seq(
      'free',
      $._expression,
      ';',
    ),

    // expression;
    expression_statement: $ => seq(
      $._expression,
      ';',
    ),

    // ;
    empty_statement: $ => ';',

    // Assignable expressions: identifiers, field access, indexing
    _assignable: $ => choice(
      $.field_expression,
      $.index_expression,
      $.identifier,
    ),

    // Expressions with precedence
    _expression: $ => choice(
      $.binary_expression,
      $._primary,
    ),

    binary_expression: $ => {
      const left = prec.left;
      const table = [
        [1, choice('==', '!=', '<', '>', '<=', '>=')],
        [2, choice('+', '-')],
        [3, choice('*', '/')],
      ];

      return choice(...table.map(([precedence, operator]) =>
        left(precedence, seq(
          $._expression,
          operator,
          $._expression,
        ))
      ));
    },

    // Primary expressions (no alloc)
    _primary: $ => choice(
      $.call_expression,
      $.index_expression,
      $.field_expression,
      $.unary_expression,
      $.identifier,
      $.number_literal,
      $.string_literal,
      seq('(', $._expression, ')'),
    ),

    // function(arg1, arg2) or Entity.alloc(field: value)
    call_expression: $ => prec(5, seq(
      choice($.field_expression, $.identifier),
      '(',
      optional(commaSep($._expression)),
      ')',
    )),

    // array[i, j, k]
    index_expression: $ => prec(4, seq(
      $.identifier,
      '[',
      commaSep1($._expression),
      ']',
    )),

    // obj.field or expr.field
    field_expression: $ => prec.left(4, seq(
      $._primary,
      '.',
      $.identifier,
    )),

    // unary operators (-, !)
    unary_expression: $ => prec(6, seq(
      choice('-', '!'),
      $._primary,
    )),

    // Literals
    number_literal: $ => /[0-9]+(\.[0-9]+)?/,
    string_literal: $ => /"([^"\\]|\\.)*"/,

    // Identifier: [a-zA-Z_][a-zA-Z0-9_]*
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Comments: // ...
    comment: $ => /\/\/.*/,
  },
});

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
