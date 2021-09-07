import { produce } from 'immer'
import { addTableInfoCollection, initConfigCollections } from '../metadata'
import { Database } from '../types'
import { TableInfoStore, tableInfoStore } from './store'

export const getJwt = () => tableInfoStore.getState().jwt

export const setAuthStatus = (status: boolean, jwt: string, isAdmin: boolean) =>
  tableInfoStore.setState(
    produce<TableInfoStore>((partial) => {
      partial.authenticated = status
      partial.jwt = jwt
      partial.admin = status ? isAdmin : false
    })
  )

export const setJwt = (jwt: string) =>
  tableInfoStore.setState(
    produce<TableInfoStore>((partial) => {
      partial.jwt = jwt
    })
  )

export const onAuthChange =
  (db: Database) => async (authenticated: boolean) => {
    if (authenticated) {
      await initConfigCollections(db)
      db.isConfigReady$.subscribe(async (ready) => {
        if (ready) {
          await addTableInfoCollection(db)
        }
      })
    }
  }
