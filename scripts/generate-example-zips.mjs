import { promises as fs } from 'node:fs'
import path from 'node:path'

const sourceRoot = path.resolve('examples/ers-ai-workflow')
const outputDir = path.resolve('public/downloads')
const outputFile = path.join(outputDir, 'ers-ai-vezbe-5-8.zip')
const archiveRoot = 'ers-ai-vezbe-5-8'
const ignoredDirectories = new Set(['bin', 'obj', '.vs'])

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index
  for (let bit = 0; bit < 8; bit += 1) value = (value & 1) ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1)
  return value >>> 0
})

function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function dosTimestamp(date) {
  const year = Math.max(1980, date.getFullYear())
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2)
  const day = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()
  return { time, day }
}

async function collectFiles(directory, prefix = '') {
  const result = []
  const entries = await fs.readdir(directory, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name))

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue
    if (entry.name === '.DS_Store') continue

    const absolute = path.join(directory, entry.name)
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name

    if (entry.isDirectory()) result.push(...await collectFiles(absolute, relative))
    else if (entry.isFile()) result.push({ absolute, relative })
  }

  return result
}

async function createZip() {
  const files = await collectFiles(sourceRoot)
  const localParts = []
  const centralParts = []
  let offset = 0

  for (const file of files) {
    const data = await fs.readFile(file.absolute)
    const stat = await fs.stat(file.absolute)
    const name = Buffer.from(`${archiveRoot}/${file.relative.replaceAll('\\', '/')}`, 'utf8')
    const checksum = crc32(data)
    const { time, day } = dosTimestamp(stat.mtime)

    const local = Buffer.alloc(30)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x0800, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(day, 12)
    local.writeUInt32LE(checksum, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    localParts.push(local, name, data)

    const central = Buffer.alloc(46)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(time, 12)
    central.writeUInt16LE(day, 14)
    central.writeUInt32LE(checksum, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)
    centralParts.push(central, name)

    offset += local.length + name.length + data.length
  }

  const centralDirectory = Buffer.concat(centralParts)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralDirectory.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  await fs.mkdir(outputDir, { recursive: true })
  await fs.writeFile(outputFile, Buffer.concat([...localParts, centralDirectory, end]))
  console.log(`Generated ${path.relative(process.cwd(), outputFile)} (${files.length} files)`)
}

await createZip()
