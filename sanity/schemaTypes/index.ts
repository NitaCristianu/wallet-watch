import { type SchemaTypeDefinition } from 'sanity'
import user from './user'
import project from './project'
import action from './action'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    user,
    action
  ],
}

