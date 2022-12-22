import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

// import Kdu from 'kdu' -> import * as Kdu from 'kdu'
export const transformAST: ASTTransformation = ({ j, root }) => {
  const importDecl = root.find(j.ImportDeclaration, {
    source: {
      value: 'kdu',
    },
  })

  importDecl.find(j.ImportDefaultSpecifier).replaceWith(({ node }) => {
    return j.importNamespaceSpecifier(node.local)
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
