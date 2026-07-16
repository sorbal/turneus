import fs from "node:fs"

import type { NetopiaConfig } from "@/lib/netopia/config"

export type NetopiaCertificates = {
  publicCertificate: string
  privateKey: string
}

export function loadNetopiaCertificates(
  config: NetopiaConfig
): NetopiaCertificates {
  return {
    publicCertificate: readCertificateFile(
      config.publicKeyPath,
      "Certificatul public NETOPIA lipseste."
    ),
    privateKey: readCertificateFile(
      config.privateKeyPath,
      "Cheia privata NETOPIA lipseste."
    ),
  }
}

function readCertificateFile(filePath: string, missingMessage: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(missingMessage)
  }

  const content = fs.readFileSync(filePath, "utf8").trim()

  if (!content) {
    throw new Error(missingMessage)
  }

  return content
}
