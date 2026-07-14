import AppKit
import Foundation

func value(_ name: String) -> String? {
  let arguments = CommandLine.arguments
  guard let index = arguments.firstIndex(of: name), index + 1 < arguments.count else {
    return nil
  }
  return arguments[index + 1]
}

func number(_ name: String, fallback: CGFloat) -> CGFloat {
  guard let raw = value(name), let parsed = Double(raw) else { return fallback }
  return CGFloat(parsed)
}

guard let output = value("--output"),
      let title = value("--title"),
      let detail = value("--detail") else {
  FileHandle.standardError.write(Data("Missing required caption arguments.\n".utf8))
  exit(1)
}

let width = number("--width", fallback: 1920)
let height = number("--height", fallback: 1080)
let fontName = value("--font") ?? "Avenir Next"
let titleSize = number("--title-size", fallback: 23)
let detailSize = number("--detail-size", fallback: 15)
let left = number("--left", fallback: 72)
let titleBottom = number("--title-bottom", fallback: 112)
let detailBottom = number("--detail-bottom", fallback: 84)

guard let bitmap = NSBitmapImageRep(
  bitmapDataPlanes: nil,
  pixelsWide: Int(width),
  pixelsHigh: Int(height),
  bitsPerSample: 8,
  samplesPerPixel: 4,
  hasAlpha: true,
  isPlanar: false,
  colorSpaceName: .deviceRGB,
  bitmapFormat: [],
  bytesPerRow: 0,
  bitsPerPixel: 0
) else {
  FileHandle.standardError.write(Data("Could not create caption bitmap.\n".utf8))
  exit(1)
}

guard let context = NSGraphicsContext(bitmapImageRep: bitmap) else {
  FileHandle.standardError.write(Data("Could not create caption graphics context.\n".utf8))
  exit(1)
}

NSGraphicsContext.saveGraphicsState()
NSGraphicsContext.current = context
NSColor.clear.setFill()
NSBezierPath(rect: NSRect(x: 0, y: 0, width: width, height: height)).fill()

let titleFont = NSFont(name: "\(fontName) Demi Bold", size: titleSize)
  ?? NSFont(name: fontName, size: titleSize)
  ?? NSFont.systemFont(ofSize: titleSize, weight: .semibold)
let detailFont = NSFont(name: fontName, size: detailSize)
  ?? NSFont.systemFont(ofSize: detailSize, weight: .regular)

let titleAttributes: [NSAttributedString.Key: Any] = [
  .font: titleFont,
  .foregroundColor: NSColor(white: 1, alpha: 0.88),
  .kern: 1.2,
]
let detailAttributes: [NSAttributedString.Key: Any] = [
  .font: detailFont,
  .foregroundColor: NSColor(white: 1, alpha: 0.72),
  .kern: 0.15,
]

(title as NSString).draw(at: NSPoint(x: left, y: titleBottom), withAttributes: titleAttributes)
(detail as NSString).draw(at: NSPoint(x: left, y: detailBottom), withAttributes: detailAttributes)
NSGraphicsContext.restoreGraphicsState()

guard let png = bitmap.representation(using: NSBitmapImageRep.FileType.png, properties: [:]) else {
  FileHandle.standardError.write(Data("Could not encode caption image.\n".utf8))
  exit(1)
}

try png.write(to: URL(fileURLWithPath: output))
