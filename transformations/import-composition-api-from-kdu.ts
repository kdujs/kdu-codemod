// this file is served as a boilerplate template for writing more complex transformations
import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

// TODO: SetupContext.refs does not exist in Kdu 3.0
export const transformAST: ASTTransformation = ({ root, j }) => {
  const importDecl = root.find(j.ImportDeclaration, {
    source: {
      value: '@kdujs/composition-api',
    },
  })

  const specifiers = importDecl.find(j.ImportSpecifier)
  const namespaceSpecifier = importDecl.find(j.ImportNamespaceSpecifier)

  if (!specifiers.length && !namespaceSpecifier.length) {
    return
  }

  const lastKCAImportDecl = importDecl.at(-1)
  if (specifiers.length) {
    lastKCAImportDecl.insertAfter(
      j.importDeclaration([...specifiers.nodes()], j.stringLiteral('kdu'))
    )
  }
  if (namespaceSpecifier.length) {
    lastKCAImportDecl.insertAfter(
      j.importDeclaration(
        [...namespaceSpecifier.nodes()],
        j.stringLiteral('kdu')
      )
    )
  }

  importDecl.forEach((path) => {
    // the default import should be left untouched to be taken care of by `remove-kdu-use`
    path.node.specifiers = path.node.specifiers.filter((s) =>
      j.ImportDefaultSpecifier.check(s)
    )

    if (!path.node.specifiers.length) {
      path.prune()
    }
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
