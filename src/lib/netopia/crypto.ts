import {
  constants,
  createCipheriv,
  publicEncrypt,
  randomBytes,
} from "node:crypto"

export type NetopiaEncryptedPayload = {
  envKey: string
  data: string
  cipher: "aes-256-cbc"
  iv: string
}

export function encryptNetopiaPayload(
  xml: string,
  publicCertificate: string
): NetopiaEncryptedPayload {
  const aesKey = randomBytes(32)
  const iv = randomBytes(16)
  const cipher = createCipheriv("aes-256-cbc", aesKey, iv)
  const encryptedData = Buffer.concat([
    cipher.update(xml, "utf8"),
    cipher.final(),
  ])
  const encryptedKey = publicEncrypt(
    {
      key: publicCertificate,
      padding: constants.RSA_PKCS1_PADDING,
    },
    aesKey
  )

  return {
    envKey: encryptedKey.toString("base64"),
    data: encryptedData.toString("base64"),
    cipher: "aes-256-cbc",
    iv: iv.toString("base64"),
  }
}
