import groups from './groups.json'

interface GetGroupsResponse {
  result: 1 | 0
  data?: GroupType[]
}

// export interface sortType {
//     private: {
//         'по типу приватности':
//     }
// } 

export interface GroupType {
  id: number
  name: string
  closed: boolean
  avatar_color?: string
  members_count: number
  friends?: User[]
}

export interface User {
  first_name: string
  last_name: string
}

export const fetchGroups = (): Promise<GetGroupsResponse> => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ result: 1, data: groups })
      rej({ result: 0})
      rej({ result: 1})
    }, 1000)
  })
}
