import path from "node:path"

export type NetopiaMode = "sandbox" | "live"

export type NetopiaConfig = {
  mode: NetopiaMode
  signature: string
  publicKeyPath: string
  privateKeyPath: string
  appUrl: string
  endpoint: string
}

const sandboxEndpoint = "https://sandboxsecure.mobilpay.ro"
const liveEndpoint = "https://secure.mobilpay.ro"

export function getNetopiaConfig(): NetopiaConfig {
  const mode = readNetopiaMode()
  const signature = readRequiredEnv("NETOPIA_SIGNATURE")
  const publicKeyPath = resolveConfiguredPath(
    readRequiredEnv("NETOPIA_PUBLIC_KEY_PATH")
  )
  const privateKeyPath = resolveConfiguredPath(
    readRequiredEnv("NETOPIA_PRIVATE_KEY_PATH")
  )
  const appUrl = normalizeAppUrl(readRequiredEnv("APP_URL"))

  return {
    mode,
    signature,
    publicKeyPath,
    privateKeyPath,
    appUrl,
    endpoint: mode === "sandbox" ? sandboxEndpoint : liveEndpoint,
  }
}

function readNetopiaMode(): NetopiaMode {
  const mode = readRequiredEnv("NETOPIA_MODE").toLowerCase()

  if (mode === "sandbox" || mode === "live") {
    return mode
  }

  throw new Error("NETOPIA_MODE trebuie sa fie sandbox sau live.")
}

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`Variabila de mediu ${name} lipseste.`)
  }

  return value
}

function resolveConfiguredPath(value: string) {
  return path.isAbsolute(value)
    ? value
    : path.join(/* turbopackIgnore: true */ process.cwd(), value)
}

function normalizeAppUrl(value: string) {
  try {
    const url = new URL(value)
    url.pathname = url.pathname.replace(/\/+$/, "")
    url.search = ""
    url.hash = ""

    return url.toString().replace(/\/$/, "")
  } catch {
    throw new Error("APP_URL este invalid.")
  }
}
