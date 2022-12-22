import wrap from '../src/wrapAstTransformation'
import type { ASTTransformation } from '../src/wrapAstTransformation'

import { transformAST as kduAsNamespaceImport } from './kdu-as-namespace-import'
import { transformAST as importCompositionApiFromKdu } from './import-composition-api-from-kdu'
import { transformAST as newKduTocreateApp } from './new-kdu-to-create-app'
import { transformAST as rootPropToUse } from './root-prop-to-use'
import { transformAST as removeTrivialRoot } from './remove-trivial-root'
import { transformAST as removeProductionTip } from './remove-production-tip'
import { transformAST as removeKduUse } from './remove-kdu-use'
import { transformAST as removeContextualHFromRender } from './remove-contextual-h-from-render'

import { transformAST as removeExtraneousImport } from './remove-extraneous-import'

export const transformAST: ASTTransformation = (context) => {
  kduAsNamespaceImport(context)
  importCompositionApiFromKdu(context)
  newKduTocreateApp(context)
  rootPropToUse(context, { rootPropName: 'store' })
  rootPropToUse(context, { rootPropName: 'router' })
  removeTrivialRoot(context)
  removeProductionTip(context)

  // TODO:
  // should analyze the AST to get the default import of kdu-router and kdux,
  // rather than hard-coding the names
  removeKduUse(context, { removablePlugins: ['KduRouter', 'Kdux'] })
  removeContextualHFromRender(context)

  removeExtraneousImport(context, { localBinding: 'Kdu' })
  removeExtraneousImport(context, { localBinding: 'Kdux' })
  removeExtraneousImport(context, { localBinding: 'KduRouter' })
}

export default wrap(transformAST)
export const parser = 'babylon'
