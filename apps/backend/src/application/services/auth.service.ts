import type { NewUser, User } from "@repo/contract/schemas"
import { singleton } from "tsyringe"
import {
  createSigner,
  createVerifier,
  type VerifierSync,
  type SignerSync,
} from "fast-jwt"
import argon2 from "@node-rs/argon2"
import config from "@/infra/config"
import { randomBytes } from "node:crypto"
import { v4 } from "@napi-rs/uuid"

export type DbUser = User & {
  password: string
}

export type TokenPayload = Pick<User, "id" | "email">

type Signer = typeof SignerSync<TokenPayload>
type Verifier = typeof VerifierSync<string>

@singleton()
export class AuthService {
  #userDb: DbUser[]
  #verify: Verifier
  #sign: Signer
  #hashSecret: Buffer

  constructor() {
    this.#userDb = []

    const JWT_SECRET = config.auth.JWT_SECRET
    this.#verify = createVerifier({ algorithms: ["HS256"], key: JWT_SECRET })
    this.#sign = createSigner({ key: JWT_SECRET, algorithm: "HS256" })

    this.#hashSecret = Buffer.from(config.auth.HASH_SECRET, "ascii")
  }

  async register(newUser: NewUser): Promise<User | null> {
    const existingUser = await this.fetchUserByEmail(newUser.email)
    if (existingUser) {
      return null
    }

    const user: User = {
      id: v4(),
      email: newUser.email,
      name: newUser.name,
    }

    const haashedPassword = await argon2.hash(newUser.password, {
      secret: this.#hashSecret,
      salt: randomBytes(16),
    })

    this.#userDb.push({ ...user, password: haashedPassword })

    return user
  }

  async fetchUserByEmail(email: string): Promise<DbUser | null> {
    return this.#userDb.find((user) => user.email === email) || null
  }

  async fetchUserById(id: string): Promise<DbUser | null> {
    return this.#userDb.find((user) => user.id === id) || null
  }

  async checkPassword(user: DbUser, password: string): Promise<boolean> {
    return argon2.verify(user.password, password, { secret: this.#hashSecret })
  }

  encodeToken(user: User): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    }

    return this.#sign(payload)
  }

  decodeToken(token: string): TokenPayload | null {
    try {
      return this.#verify(token)
    } catch (error) {
      return null
    }
  }
}
