import { PrimaryProperty, TopLevelProperty } from 'rxdb/dist/types/types'

import { ColumnFragment, CoreTableFragment, Metadata } from '../..'
import { metadataName } from '.'
import { propertyJsonType } from './property'

export const createRelationshipProperties = (
  table: Metadata,
  role: string
): Record<string, TopLevelProperty | PrimaryProperty> => {
  const result: Record<string, TopLevelProperty | PrimaryProperty> = {}
  table.relationships
    .filter(relationship => relationship.mapping.length)
    .map(relationship => {
      const relName = relationship.rel_name as string
      const mappingItem = relationship.mapping[0]
      const column = mappingItem.column as ColumnFragment
      const refTable = mappingItem.remoteTable as CoreTableFragment
      const ref = `${role}_${metadataName(refTable)}`

      const type = propertyJsonType(column)
      if (relationship.mapping.length !== 1)
        throw Error(
          'object relationship with multi-column keys are not supported'
        )
      if (relationship.rel_type === 'object') {
        // * Object relationships
        result[relName] = {
          type,
          ref
        }
      } else if (relationship.rel_type === 'array') {
        // * Array relationships
        result[relName] = {
          type: 'array',
          ref,
          items: {
            type
          }
        }
        // * Add the relationship aggregates - it is needed for the replication system
        result[`${relName}_aggregate`] = {
          type: 'object',
          properties: {
            aggregate: {
              type: 'object',
              properties: {
                max: {
                  type: 'object',
                  properties: { updated_at: { type: ['string', 'null'] } }
                }
              }
            }
          }
        }
      }
    })
  return result
}
