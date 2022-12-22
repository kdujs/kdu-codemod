import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

// import { Component } from 'kdu-class-component' ->
// import { Options as Component } from 'kdu-class-component'
export const transformAST: ASTTransformation = (context) => {
  const { j, root } = context

  const kduClassComponentImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'kdu-class-component',
    },
  })

  const ComponentImportSpec = kduClassComponentImportDecls.find(
    j.ImportSpecifier,
    {
      imported: {
        name: 'Component',
      },
    }
  )

  ComponentImportSpec.replaceWith(({ node }) => {
    return j.importSpecifier(j.identifier('Options'), j.identifier('Component'))
  })
}

export default wrap(transformAST)
export const parser = 'babylon'
