import type { UserRole } from "@/generated/prisma/client"
import { hashPassword } from "@/lib/auth/password"
import {
  findCityById,
  findUserByEmail,
  findUserById,
  findUserByUsername,
  findUsers,
  updateUser,
  updateUserActiveStatus,
  updateUserPasswordHash,
  updateUserRole,
  type UserUpdateData,
} from "@/repositories/user.repository"

export type UpdateUserInput = {
  firstName?: string
  lastName?: string
  email?: string
  username?: string
  phone?: string | null
  cityId?: string | null
  birthDate?: Date | string | null
  avatarUrl?: string | null
  bio?: string | null
}

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "UserServiceError"
  }
}

export async function getUsers(search?: string) {
  return findUsers(search)
}

export async function getUserById(id: string) {
  assertId(id, "ID-ul utilizatorului este obligatoriu.")
  return findUserById(id)
}

export async function updateUserRecord(id: string, input: UpdateUserInput) {
  assertId(id, "ID-ul utilizatorului este obligatoriu.")

  const existingUser = await findUserById(id)

  if (!existingUser) {
    throw new UserServiceError("Utilizatorul nu exista.")
  }

  const data: UserUpdateData = {}

  if (input.firstName !== undefined) {
    data.firstName = normalizeRequiredText(
      input.firstName,
      "Prenumele este obligatoriu."
    )
  }

  if (input.lastName !== undefined) {
    data.lastName = normalizeRequiredText(
      input.lastName,
      "Numele este obligatoriu."
    )
  }

  if (input.email !== undefined) {
    data.email = normalizeEmail(input.email)
    await assertUniqueEmail(data.email, id)
  }

  if (input.username !== undefined) {
    data.username = normalizeRequiredText(
      input.username,
      "Username-ul este obligatoriu."
    )
    await assertUniqueUsername(data.username, id)
  }

  if (input.phone !== undefined) {
    data.phone = normalizeOptionalText(input.phone)
  }

  if (input.cityId !== undefined) {
    data.cityId = normalizeOptionalText(input.cityId)
    await assertCityExists(data.cityId)
  }

  if (input.birthDate !== undefined) {
    data.birthDate = normalizeOptionalDate(input.birthDate)
  }

  if (input.avatarUrl !== undefined) {
    data.avatarUrl = normalizeOptionalText(input.avatarUrl)
  }

  if (input.bio !== undefined) {
    data.bio = normalizeOptionalText(input.bio)
  }

  return updateUser(id, data)
}

export async function setUserRole(
  id: string,
  role: UserRole,
  currentAdminId: string
) {
  assertId(id, "ID-ul utilizatorului este obligatoriu.")
  assertId(currentAdminId, "ID-ul adminului curent este obligatoriu.")

  if (id === currentAdminId) {
    throw new UserServiceError("Nu iti poti schimba propriul rol.")
  }

  assertAllowedRole(role)

  const existingUser = await findUserById(id)

  if (!existingUser) {
    throw new UserServiceError("Utilizatorul nu exista.")
  }

  if (existingUser.organizerProfile) {
    throw new UserServiceError(
      "Rolul unui organizator se gestioneaza prin modulul Organizers."
    )
  }

  return updateUserRole(id, role)
}

export async function setUserActiveStatus(
  id: string,
  isActive: boolean,
  currentAdminId: string
) {
  assertId(id, "ID-ul utilizatorului este obligatoriu.")
  assertId(currentAdminId, "ID-ul adminului curent este obligatoriu.")

  if (id === currentAdminId && !isActive) {
    throw new UserServiceError("Nu iti poti dezactiva propriul cont.")
  }

  const existingUser = await findUserById(id)

  if (!existingUser) {
    throw new UserServiceError("Utilizatorul nu exista.")
  }

  return updateUserActiveStatus(id, isActive)
}

export async function resetUserPassword(id: string, newPassword: string) {
  assertId(id, "ID-ul utilizatorului este obligatoriu.")

  const existingUser = await findUserById(id)

  if (!existingUser) {
    throw new UserServiceError("Utilizatorul nu exista.")
  }

  const password = normalizeRequiredText(
    newPassword,
    "Parola noua este obligatorie."
  )

  if (password.length < 8) {
    throw new UserServiceError("Parola trebuie sa aiba minimum 8 caractere.")
  }

  const passwordHash = await hashPassword(password)

  return updateUserPasswordHash(id, passwordHash)
}

function normalizeRequiredText(value: string, message: string) {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    throw new UserServiceError(message)
  }

  return normalizedValue
}

function normalizeOptionalText(value: string | null | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}

function normalizeEmail(value: string) {
  const email = normalizeRequiredText(value, "Emailul este obligatoriu.")

  if (!email.includes("@")) {
    throw new UserServiceError("Email invalid.")
  }

  return email
}

function normalizeOptionalDate(value: Date | string | null) {
  if (value === null) {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new UserServiceError("Data nasterii este invalida.")
  }

  return date
}

async function assertUniqueEmail(email: string, currentUserId: string) {
  const existingUser = await findUserByEmail(email)

  if (existingUser && existingUser.id !== currentUserId) {
    throw new UserServiceError("Exista deja un utilizator cu acest email.")
  }
}

async function assertUniqueUsername(username: string, currentUserId: string) {
  const existingUser = await findUserByUsername(username)

  if (existingUser && existingUser.id !== currentUserId) {
    throw new UserServiceError("Exista deja un utilizator cu acest username.")
  }
}

async function assertCityExists(cityId: string | null | undefined) {
  if (!cityId) {
    return
  }

  const city = await findCityById(cityId)

  if (!city) {
    throw new UserServiceError("Orasul nu exista.")
  }
}

function assertAllowedRole(role: UserRole) {
  if (role !== "PLAYER" && role !== "ADMIN") {
    throw new UserServiceError(
      "Rolul ORGANIZER se gestioneaza prin modulul Organizers."
    )
  }
}

function assertId(id: string, message: string) {
  if (!id.trim()) {
    throw new UserServiceError(message)
  }
}
