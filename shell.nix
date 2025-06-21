with import <nixpkgs> { };

mkShell {
  buildInputs = [ bun sqlite ];
}
