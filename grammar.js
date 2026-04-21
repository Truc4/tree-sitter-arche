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
      field('name', $.identifier),
      '(',
      optional(commaSep($.identifier)),
      ')',
    ),

    // arche Player { field: Type, field: Type }
    // or archetype Player { ... }
    archetype_declaration: $ => seq(
      choice('arche', 'archetype'),
      field('name', $.identifier),
      '{',
      repeat($.field_declaration),
      '}',
    ),

    // position: Vec3,  or  health: Float
    field_declaration: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type),
      optional(','),
    ),

    // proc init() { ... }
    // proc move(pos, vel) { ... }
    proc_declaration: $ => seq(
      'proc',
      field('name', $.identifier),
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
      field('name', $.identifier),
      '(',
      optional(commaSep($.identifier)),
      ')',
      '{',
      repeat($._statement),
      '}',
    ),

    // func clamp(value: Float, ...) -> Float { expr }
    func_declaration: $ => seq(
      'func',
      field('name', $.identifier),
      '(',
      optional(commaSep($.parameter)),
      ')',
      '->',
      field('return_type', $.type),
      '{',
      field('body', $._expression),
      '}',
    ),

    // extern proc write(fd: Int, buf: Str, len: Int);
    extern_declaration: $ => seq(
      'extern',
      'proc',
      field('name', $.identifier),
      '(',
      optional(commaSep($.parameter)),
      ')',
      ';',
    ),

    // name: Type
    parameter: $ => seq(
      field('name', $.identifier),
      ':',
      field('type', $.type),
    ),

    // Type is identifier or identifier[] (Int, Float, Vec3, char[], etc.)
    type: $ => seq(
      $.identifier,
      optional('[]'),
    ),

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
      field('name', $.identifier),
      '=',
      field('value', $._expression),
      ';',
    ),

    // pos = pos + vel;  or  x += 5;
    assignment_statement: $ => seq(
      field('target', $._assignable),
      field('operator', $.assign_op),
      field('value', $._expression),
      ';',
    ),

    assign_op: $ => choice('=', '+=', '-=', '*=', '/='),

    // for i in players { ... }
    for_statement: $ => seq(
      'for',
      field('iterator', $.identifier),
      'in',
      field('iterable', $.identifier),
      '{',
      repeat($._statement),
      '}',
    ),

    // run move;
    run_statement: $ => seq(
      'run',
      field('system', $.identifier),
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

    // Primary expressions
    _primary: $ => choice(
      $.alloc_expression,
      $.call_expression,
      $.index_expression,
      $.field_expression,
      $.unary_expression,
      $.identifier,
      $.number_literal,
      $.string_literal,
      seq('(', $._expression, ')'),
    ),

    // alloc TypeName(count)
    alloc_expression: $ => seq(
      'alloc',
      field('type', $.identifier),
      '(',
      field('count', $._expression),
      ')',
    ),

    // function(arg1, arg2)
    call_expression: $ => prec(5, seq(
      field('function', choice($.field_expression, $.identifier)),
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
      field('object', $._primary),
      '.',
      field('field', $.identifier),
    )),

    // unary operators (-, !)
    unary_expression: $ => prec(6, seq(
      field('operator', choice('-', '!')),
      field('operand', $._primary),
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
