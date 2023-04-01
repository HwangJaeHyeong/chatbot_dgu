export function stringToArrayBuffer(str: string): ArrayBuffer {
  const stringLength = str.length
  const buffer = new ArrayBuffer(stringLength * 2)
  const bufferView = new Uint16Array(buffer)
  for (let i = 0; i < stringLength; i++) {
    bufferView[i] = str.charCodeAt(i)
  }
  return buffer
}
