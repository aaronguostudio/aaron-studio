import AppKit
import CoreText
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

guard CommandLine.arguments.count >= 5 else {
  fputs("Usage: make-thumbnail.swift <input> <output> <title> <subtitle> [brand]\n", stderr)
  exit(1)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let title = CommandLine.arguments[3]
let subtitle = CommandLine.arguments[4]
let brand = CommandLine.arguments.count > 5
  ? CommandLine.arguments[5]
  : "QUIET HOURS  /  ORIGINAL MUSIC"

guard let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
      let sourceImage = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
  fputs("Could not read input image\n", stderr)
  exit(2)
}

let width = 1280
let height = 720
let colorSpace = CGColorSpaceCreateDeviceRGB()
guard let context = CGContext(
  data: nil,
  width: width,
  height: height,
  bitsPerComponent: 8,
  bytesPerRow: width * 4,
  space: colorSpace,
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
) else {
  fputs("Could not create drawing context\n", stderr)
  exit(3)
}

context.interpolationQuality = .high
context.draw(sourceImage, in: CGRect(x: 0, y: 0, width: width, height: height))

context.setFillColor(CGColor(red: 233 / 255, green: 228 / 255, blue: 220 / 255, alpha: 0.90))
context.fill(CGRect(x: 62, y: 427, width: 620, height: 215))

func drawText(_ value: String, size: CGFloat, x: CGFloat, baselineFromTop: CGFloat, color: CGColor, tracking: CGFloat) {
  let font = CTFontCreateWithName("Georgia" as CFString, size, nil)
  let attributes: [NSAttributedString.Key: Any] = [
    NSAttributedString.Key(kCTFontAttributeName as String): font,
    NSAttributedString.Key(kCTForegroundColorAttributeName as String): color,
    NSAttributedString.Key(kCTKernAttributeName as String): tracking,
  ]
  let line = CTLineCreateWithAttributedString(NSAttributedString(string: value, attributes: attributes))
  context.textPosition = CGPoint(x: x, y: CGFloat(height) - baselineFromTop - size)
  CTLineDraw(line, context)
}

drawText(
  title,
  size: 46,
  x: 96,
  baselineFromTop: 112,
  color: CGColor(red: 37 / 255, green: 35 / 255, blue: 31 / 255, alpha: 1),
  tracking: 3
)
drawText(
  subtitle,
  size: 23,
  x: 100,
  baselineFromTop: 208,
  color: CGColor(red: 121 / 255, green: 115 / 255, blue: 106 / 255, alpha: 1),
  tracking: 2
)
drawText(
  brand,
  size: 17,
  x: 100,
  baselineFromTop: 255,
  color: CGColor(red: 157 / 255, green: 118 / 255, blue: 93 / 255, alpha: 1),
  tracking: 2
)

guard let outputImage = context.makeImage(),
      let destination = CGImageDestinationCreateWithURL(outputURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
  fputs("Could not create output image\n", stderr)
  exit(4)
}

CGImageDestinationAddImage(destination, outputImage, [kCGImageDestinationLossyCompressionQuality: 0.94] as CFDictionary)
guard CGImageDestinationFinalize(destination) else {
  fputs("Could not write output image\n", stderr)
  exit(5)
}
