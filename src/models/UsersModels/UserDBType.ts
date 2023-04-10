export type UserDBType = {
    // TODO Фиксануть userdbType
    id?: string
    login: string
    email: string
    passwordHash: string
    createdAt: string
}

type userViewType = {
    id: string,
    username: string
    email: string
}