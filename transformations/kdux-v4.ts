import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as addImport } from './add-import'
import { transformAST as removeExtraneousImport } from './remove-extraneous-import'

// new Store() -> createStore()
export const transformAST: ASTTransformation = (context) => {
  const { j, root } = context

  const kduxImportDecls = root.find(j.ImportDeclaration, {
    source: {
      value: 'kdux',
    },
  })

  const importedKdux = kduxImportDecls.find(j.ImportDefaultSpecifier)
  const importedStore = kduxImportDecls.find(j.ImportSpecifier, {
    imported: {
      name: 'Store',
    },
  })

  if (importedKdux.length) {
    const localKdux = importedKdux.get(0).node.local.name
    const newKduxDotStore = root.find(j.NewExpression, {
      callee: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: localKdux,
        },
        property: {
          name: 'Store',
        },
      },
    })

    newKduxDotStore.replaceWith(({ node }) => {
      return j.callExpression(
        j.memberExpression(
          j.identifier(localKdux),
          j.identifier('createStore')
        ),
        node.arguments
      )
    })
  }

  if (importedStore.length) {
    const localStore = importedStore.get(0).node.local.name
    const newStore = root.find(j.NewExpression, {
      callee: {
        type: 'Identifier',
        name: localStore,
      },
    })

    addImport(context, {
      specifier: {
        type: 'named',
        imported: 'createStore',
      },
      source: 'kdux',
    })
    newStore.replaceWith(({ node }) => {
      return j.callExpression(j.identifier('createStore'), node.arguments)
    })
    removeExtraneousImport(context, { localBinding: localStore })
  }
}

export default wrap(transformAST)
export const parser = 'babylon'
