import { Login } from '@/api'
import { MutationTree } from 'vuex'
import { State } from './state'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  SETTOKEN = 'SETTOKEN',
  SETUSERINFO = 'SETUSERINFO',
  SETUSERINFOLOADING = 'SETUSERINFOLOADING',
  LOGOUT = 'LOGOUT',
  NFTLOGIN = 'NFTLOGIN',
}

export type Mutations<S = State> = {
  [Mutation.INCREMENT](state: S, payload: number): void
  [Mutation.SETTOKEN](state: S, payload: Token): void
  [Mutation.SETUSERINFO](state: S, payload: UserInfo): void
  [Mutation.SETUSERINFOLOADING](state: S, payload: boolean): void
  [Mutation.LOGOUT](state: S): void
  [Mutation.NFTLOGIN](state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.INCREMENT](state: State, payload: number = 1) {
    state.count += payload
  },
  [Mutation.SETTOKEN](state: State, payload: Token) {
    localStorage.setItem('token', JSON.stringify(payload))
    state.token = payload
  },
  [Mutation.SETUSERINFO](state: State, payload: UserInfo) {
    state.userInfo = payload
    state.userInfoLoading = false
  },
  [Mutation.SETUSERINFOLOADING](state: State, payload: boolean) {
    state.userInfoLoading = payload
  },
  [Mutation.LOGOUT](state: State) {
    localStorage.removeItem('token')
    state.token = null
    state.userInfo = null
    state.sdk = null
  },
  async [Mutation.NFTLOGIN](state: State) {
    const timestamp = new Date().getTime().toString()
    const message = state.userInfo!.metaId + timestamp
    const response = await state.sdk!.signMessage({
      message,
    })
    debugger
    const res = await Login({
      metaId: state.userInfo!.metaId,
      xpub: state.userInfo!.xpub,
      msg: response.data.result,
      timestamp,
      type: state.isApp ? '0' : '2',
    })
    debugger
  },
}
