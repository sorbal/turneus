export type XmlNode = {
  name: string
  attributes: Record<string, string>
  children: XmlNode[]
  text: string
}

type XmlToken =
  | {
      type: "open"
      name: string
      attributes: Record<string, string>
      selfClosing: boolean
    }
  | {
      type: "close"
      name: string
    }
  | {
      type: "text"
      value: string
    }

export function parseXmlStrict(xml: string): XmlNode {
  const root: XmlNode = {
    name: "#document",
    attributes: {},
    children: [],
    text: "",
  }
  const stack: XmlNode[] = [root]
  let cursor = 0

  while (cursor < xml.length) {
    const nextTagStart = xml.indexOf("<", cursor)

    if (nextTagStart === -1) {
      addText(stack, xml.slice(cursor))
      break
    }

    addText(stack, xml.slice(cursor, nextTagStart))

    const nextTagEnd = xml.indexOf(">", nextTagStart + 1)

    if (nextTagEnd === -1) {
      throw new Error("XML invalid.")
    }

    const rawToken = xml.slice(nextTagStart + 1, nextTagEnd).trim()
    cursor = nextTagEnd + 1

    if (!rawToken || rawToken.startsWith("?") || rawToken.startsWith("!")) {
      continue
    }

    applyToken(stack, parseToken(rawToken))
  }

  if (stack.length !== 1) {
    throw new Error("XML invalid.")
  }

  if (root.children.length !== 1) {
    throw new Error("XML invalid.")
  }

  return root.children[0]
}

export function getRequiredChild(node: XmlNode, name: string) {
  const child = node.children.find((item) => item.name === name)

  if (!child) {
    throw new Error(`Element XML lipsa: ${name}.`)
  }

  return child
}

export function getOptionalChild(node: XmlNode, name: string) {
  return node.children.find((item) => item.name === name) ?? null
}

export function getRequiredText(node: XmlNode, name: string) {
  const value = getRequiredChild(node, name).text.trim()

  if (!value) {
    throw new Error(`Valoare XML lipsa: ${name}.`)
  }

  return value
}

export function getOptionalText(node: XmlNode, name: string) {
  const value = getOptionalChild(node, name)?.text.trim()

  return value ? value : null
}

export function getRequiredAttribute(node: XmlNode, name: string) {
  const value = node.attributes[name]?.trim()

  if (!value) {
    throw new Error(`Atribut XML lipsa: ${name}.`)
  }

  return value
}

function applyToken(stack: XmlNode[], token: XmlToken) {
  if (token.type === "text") {
    addText(stack, token.value)
    return
  }

  if (token.type === "close") {
    const currentNode = stack.pop()

    if (!currentNode || currentNode.name !== token.name) {
      throw new Error("XML invalid.")
    }

    return
  }

  const parent = stack[stack.length - 1]
  const node: XmlNode = {
    name: token.name,
    attributes: token.attributes,
    children: [],
    text: "",
  }

  parent.children.push(node)

  if (!token.selfClosing) {
    stack.push(node)
  }
}

function parseToken(rawToken: string): XmlToken {
  if (rawToken.startsWith("/")) {
    return {
      type: "close",
      name: readName(rawToken.slice(1).trim()),
    }
  }

  const selfClosing = rawToken.endsWith("/")
  const content = selfClosing ? rawToken.slice(0, -1).trim() : rawToken
  const name = readName(content)
  const attributeSource = content.slice(name.length).trim()

  return {
    type: "open",
    name,
    attributes: parseAttributes(attributeSource),
    selfClosing,
  }
}

function parseAttributes(source: string) {
  const attributes: Record<string, string> = {}
  let cursor = 0

  while (cursor < source.length) {
    cursor = skipWhitespace(source, cursor)

    if (cursor >= source.length) {
      break
    }

    const nameStart = cursor

    while (
      cursor < source.length &&
      !isWhitespace(source[cursor]) &&
      source[cursor] !== "="
    ) {
      cursor += 1
    }

    const name = source.slice(nameStart, cursor)
    cursor = skipWhitespace(source, cursor)

    if (!name || source[cursor] !== "=") {
      throw new Error("Atribut XML invalid.")
    }

    cursor += 1
    cursor = skipWhitespace(source, cursor)

    const quote = source[cursor]

    if (quote !== '"' && quote !== "'") {
      throw new Error("Atribut XML invalid.")
    }

    cursor += 1
    const valueStart = cursor

    while (cursor < source.length && source[cursor] !== quote) {
      cursor += 1
    }

    if (cursor >= source.length) {
      throw new Error("Atribut XML invalid.")
    }

    attributes[name] = decodeXmlEntities(source.slice(valueStart, cursor))
    cursor += 1
  }

  return attributes
}

function addText(stack: XmlNode[], text: string) {
  if (!text) {
    return
  }

  const currentNode = stack[stack.length - 1]
  currentNode.text += decodeXmlEntities(text)
}

function readName(value: string) {
  const nameEnd = value.search(/[\s/>]/)
  const name = nameEnd === -1 ? value : value.slice(0, nameEnd)

  if (!name) {
    throw new Error("Nume XML invalid.")
  }

  return name
}

function skipWhitespace(value: string, cursor: number) {
  let nextCursor = cursor

  while (nextCursor < value.length && isWhitespace(value[nextCursor])) {
    nextCursor += 1
  }

  return nextCursor
}

function isWhitespace(value: string) {
  return value === " " || value === "\n" || value === "\r" || value === "\t"
}

function decodeXmlEntities(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
}
