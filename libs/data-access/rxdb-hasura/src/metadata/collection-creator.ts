import { RxDocument } from 'rxdb'
import { info, warn } from '@platyplus/logger'

import { collectionName, removeCollection, createCollection } from '../utils'
import {
  contentsCollectionCreator,
  equivalentSchemas,
  isManyToManyJoinTable,
  toJsonSchema
} from '../contents'
import { ContentsCollection, Database, TableInfo } from '../types'

import { tableRoles } from './utils'

export const createContentsCollections = async (
  db: Database,
  tables: RxDocument<TableInfo>[]
) => {
  for (const table of Object.values(tables).filter(
    (table) => !isManyToManyJoinTable(table)
  )) {
    for (const role of tableRoles(table)) {
      const name = collectionName(table, role)
      if (!db[name]) {
        await createCollection(db, name, contentsCollectionCreator(table, role))
      } else if (db[name].options.tableId) {
        const collection = db[name] as ContentsCollection
        const previousSchema = collection.schema.jsonSchema
        const newSchema = toJsonSchema(table, role)

        if (!equivalentSchemas(previousSchema, newSchema)) {
          info(name, `new schema. Reload the entire collection`)
          // TODO ideally, identify the column/relationship changes and delete the removed one, and go fetch the missing ones through graphql
          await removeCollection(collection)
          await createCollection(
            db,
            name,
            contentsCollectionCreator(table, role)
          )
        }
      } else {
        warn(name, `Cannot modify a non-contents collection`)
      }
    }
  }
  // }
}
