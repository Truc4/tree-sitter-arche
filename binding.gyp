{
  "targets": [
    {
      "target_name": "tree_sitter_arche_binding",
      "include_dirs": [
        "node_modules/nan",
        "src"
      ],
      "sources": [
        "bindings/node/binding.cc",
        "src/parser.c"
      ],
      "cflags_c": [
        "-std=c99"
      ]
    }
  ]
}
