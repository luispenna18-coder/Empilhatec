// Vídeo do hero da Home com a fachada nova. Usa só o que vem no macOS (AVFoundation + Core Image), sem ffmpeg.
//
//   swiftc -O scripts/home/hero-fachada.swift -o /tmp/hero-fachada
//   /tmp/hero-fachada cortes <video> <n>                                   diferença entre quadros seguidos (acha o corte)
//   /tmp/hero-fachada quadro <video> <segundos> <saida.png>                tira um quadro
//   /tmp/hero-fachada hero <foto> <video> <pular> <quadros> <saida.mp4> <bitrate>
//
// "hero" troca os primeiros <pular> quadros do vídeo (a fachada antiga) por <quadros> quadros da foto da fachada
// com aproximação lenta, e regrava o resto na sequência, a 23,976 qps.

import AVFoundation
import AppKit
import CoreImage

let args = CommandLine.arguments
let escala: Int32 = 24000
let passo: Int64 = 1001
let ci = CIContext(options: [.workingColorSpace: CGColorSpace(name: CGColorSpace.sRGB)!])
let cor709: [String: Any] = [
  AVVideoColorPrimariesKey: AVVideoColorPrimaries_ITU_R_709_2,
  AVVideoTransferFunctionKey: AVVideoTransferFunction_ITU_R_709_2,
  AVVideoYCbCrMatrixKey: AVVideoYCbCrMatrix_ITU_R_709_2,
]

func falha(_ m: String) -> Never { FileHandle.standardError.write((m + "\n").data(using: .utf8)!); exit(1) }

func faixa(_ caminho: String) -> (AVAsset, AVAssetTrack) {
  let a = AVURLAsset(url: URL(fileURLWithPath: caminho))
  guard let t = a.tracks(withMediaType: .video).first else { falha("sem vídeo em \(caminho)") }
  return (a, t)
}

func leitor(_ a: AVAsset, _ t: AVAssetTrack) -> (AVAssetReader, AVAssetReaderTrackOutput) {
  let r = try! AVAssetReader(asset: a)
  let o = AVAssetReaderTrackOutput(track: t, outputSettings: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
  ])
  o.alwaysCopiesSampleData = false
  r.add(o)
  r.startReading()
  return (r, o)
}

/// Foto ampliada uma vez (Lanczos + nitidez leve); cada quadro é um recorte dela com posição em fração de pixel.
struct Fachada {
  let img: CIImage
  let w: CGFloat, h: CGFloat
  init(_ caminho: String, alturaAlvo: CGFloat) {
    guard let base = CIImage(contentsOf: URL(fileURLWithPath: caminho)) else { falha("não abri \(caminho)") }
    let f = max(1, alturaAlvo * 1.25 / base.extent.height)
    let grande = base.clampedToExtent()
      .applyingFilter("CILanczosScaleTransform", parameters: [kCIInputScaleKey: f, kCIInputAspectRatioKey: 1.0])
      .applyingFilter("CISharpenLuminance", parameters: [kCIInputSharpnessKey: 0.35])
      .cropped(to: CGRect(x: 0, y: 0, width: (base.extent.width * f).rounded(.down), height: (base.extent.height * f).rounded(.down)))
    img = grande
    w = grande.extent.width
    h = grande.extent.height
  }

  /// zoom 1 = a foto inteira na altura; cx, cy = centro do recorte (0–1, a partir do canto superior esquerdo).
  func quadro(zoom: CGFloat, cx: CGFloat, cy: CGFloat, saida: CGSize, em pb: CVPixelBuffer) {
    let ar = saida.width / saida.height
    let baseW = min(w, h * ar), baseH = baseW / ar
    let cw = baseW / zoom, ch = baseH / zoom
    let x0 = min(max(cx * w - cw / 2, 0), w - cw)
    let y0 = min(max((1 - cy) * h - ch / 2, 0), h - ch)
    let s = saida.width / cw
    let t = CGAffineTransform(translationX: -x0, y: -y0).concatenating(CGAffineTransform(scaleX: s, y: s))
    let out = img.clampedToExtent().transformed(by: t, highQualityDownsample: true)
      .cropped(to: CGRect(origin: .zero, size: saida))
    ci.render(out, to: pb, bounds: CGRect(origin: .zero, size: saida), colorSpace: CGColorSpace(name: CGColorSpace.itur_709)!)
  }
}

func gravador(_ caminho: String, _ tam: CGSize, _ bitrate: Int) -> (AVAssetWriter, AVAssetWriterInput, AVAssetWriterInputPixelBufferAdaptor) {
  try? FileManager.default.removeItem(atPath: caminho)
  let w = try! AVAssetWriter(outputURL: URL(fileURLWithPath: caminho), fileType: .mp4)
  w.shouldOptimizeForNetworkUse = true
  let i = AVAssetWriterInput(mediaType: .video, outputSettings: [
    AVVideoCodecKey: AVVideoCodecType.h264,
    AVVideoWidthKey: tam.width,
    AVVideoHeightKey: tam.height,
    AVVideoColorPropertiesKey: cor709,
    AVVideoCompressionPropertiesKey: [
      AVVideoAverageBitRateKey: bitrate,
      AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
      AVVideoH264EntropyModeKey: AVVideoH264EntropyModeCABAC,
      AVVideoMaxKeyFrameIntervalKey: 240,
      AVVideoAllowFrameReorderingKey: true,
      AVVideoExpectedSourceFrameRateKey: 24,
    ] as [String: Any],
  ])
  i.expectsMediaDataInRealTime = false
  let ad = AVAssetWriterInputPixelBufferAdaptor(assetWriterInput: i, sourcePixelBufferAttributes: [
    kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_32BGRA,
    kCVPixelBufferWidthKey as String: tam.width,
    kCVPixelBufferHeightKey as String: tam.height,
  ])
  w.add(i)
  guard w.startWriting() else { falha("gravador: \(String(describing: w.error))") }
  w.startSession(atSourceTime: .zero)
  return (w, i, ad)
}

func anexar(_ ad: AVAssetWriterInputPixelBufferAdaptor, _ i: AVAssetWriterInput, _ pb: CVPixelBuffer, _ n: Int64) {
  while !i.isReadyForMoreMediaData { usleep(2000) }
  if !ad.append(pb, withPresentationTime: CMTime(value: n * passo, timescale: escala)) { falha("falhou no quadro \(n)") }
}

func fechar(_ w: AVAssetWriter, _ i: AVAssetWriterInput) {
  i.markAsFinished()
  let s = DispatchSemaphore(value: 0)
  w.finishWriting { s.signal() }
  s.wait()
  if w.status != .completed { falha("gravador: \(String(describing: w.error))") }
}

switch args.count > 1 ? args[1] : "" {
case "cortes":
  let (a, t) = faixa(args[2])
  let (r, o) = leitor(a, t)
  var antes: [UInt8] = []
  var n = 0
  while n < Int(args[3])!, let sb = o.copyNextSampleBuffer(), let pb = CMSampleBufferGetImageBuffer(sb) {
    CVPixelBufferLockBaseAddress(pb, .readOnly)
    let base = CVPixelBufferGetBaseAddressOfPlane(pb, 0)!.assumingMemoryBound(to: UInt8.self)
    let bpr = CVPixelBufferGetBytesPerRowOfPlane(pb, 0), hh = CVPixelBufferGetHeightOfPlane(pb, 0), ww = CVPixelBufferGetWidthOfPlane(pb, 0)
    var agora: [UInt8] = []
    for y in stride(from: 0, to: hh, by: 16) { for x in stride(from: 0, to: ww, by: 16) { agora.append(base[y * bpr + x]) } }
    CVPixelBufferUnlockBaseAddress(pb, .readOnly)
    var d = 0
    if !antes.isEmpty { for k in 0..<agora.count { d += abs(Int(agora[k]) - Int(antes[k])) } }
    let pts = CMSampleBufferGetPresentationTimeStamp(sb)
    print(String(format: "%3d  %.4f s  dif %.1f", n, pts.seconds, Double(d) / Double(max(agora.count, 1))))
    antes = agora
    n += 1
  }
  r.cancelReading()

case "quadro":
  let (a, _) = faixa(args[2])
  let g = AVAssetImageGenerator(asset: a)
  g.requestedTimeToleranceBefore = .zero
  g.requestedTimeToleranceAfter = .zero
  let cg = try! g.copyCGImage(at: CMTime(seconds: Double(args[3])!, preferredTimescale: 24000), actualTime: nil)
  try! NSBitmapImageRep(cgImage: cg).representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: args[4]))

case "hero":
  let (a, t) = faixa(args[3])
  let pular = Int(args[4])!, quadros = Int(args[5])!
  let tam = t.naturalSize
  let foto = Fachada(args[2], alturaAlvo: tam.height)
  let (w, i, ad) = gravador(args[6], tam, Int(args[7])!)

  // aproximação lenta sobre a entrada da loja: de 1,00 a 1,07, com o centro indo um pouco para a direita
  for n in 0..<quadros {
    var pb: CVPixelBuffer?
    CVPixelBufferPoolCreatePixelBuffer(nil, ad.pixelBufferPool!, &pb)
    let p = CGFloat(n) / CGFloat(max(quadros - 1, 1))
    foto.quadro(zoom: 1.0 + 0.07 * p, cx: 0.5 + 0.06 * p, cy: 0.5, saida: tam, em: pb!)
    anexar(ad, i, pb!, Int64(n))
  }

  let (r, o) = leitor(a, t)
  var n = 0
  while let sb = o.copyNextSampleBuffer() {
    defer { n += 1 }
    if n < pular { continue }
    guard let pb = CMSampleBufferGetImageBuffer(sb) else { continue }
    anexar(ad, i, pb, Int64(quadros + n - pular))
  }
  if r.status == .failed { falha("leitor: \(String(describing: r.error))") }
  fechar(w, i)
  print("quadros: \(quadros) da fachada + \(n - pular) do vídeo")

default:
  falha("uso: cortes | quadro | hero (ver o topo do arquivo)")
}
