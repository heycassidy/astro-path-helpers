export type PathHelpersOptions = Record<string, never> // no options supported yet

// name, params, and path
export type HelperTemplateContext = {
  name: string
  params: string
  path: string
}

export type HelperTemplateContextStore = Map<string, HelperTemplateContext>

export type CodegenFileName = "generated"
