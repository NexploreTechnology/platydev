import { clone, isRxDocument, RxDocument } from 'rxdb'
import { DeepReadonly, DeepReadonlyObject } from 'rxdb/dist/types/types'

import { Contents, ContentsDocument } from '../types'

export * from './collections'
export * from './graphql'
export * from './hasura'
export * from './jsonata'
export * from './replicator'
export * from './types'

export const documentContents = <T>(doc: T | RxDocument<T>): DeepReadonly<T> =>
  isRxDocument(doc) ? (doc as RxDocument<T>).toJSON() : (doc as DeepReadonly<T>)

export const populateDocument = async (
  doc: DeepReadonlyObject<ContentsDocument>
): Promise<Contents> => {
  const result: ContentsDocument = clone(doc)
  for (const field of doc.collection.schema.topLevelFields) {
    if (doc.collection.schema.jsonSchema.properties[field].ref) {
      const population = await doc.populate(field)
      result[field] =
        population &&
        (Array.isArray(population)
          ? population.map((item) => item.toJSON())
          : population.toJSON())
    }
  }
  return result
}
