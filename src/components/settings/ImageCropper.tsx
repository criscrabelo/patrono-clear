import { useState, useRef } from 'react'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Crop, ZoomIn, ZoomOut } from 'lucide-react'

interface ImageCropperProps {
  imageUrl: string
  onCrop: (dataUrl: string) => void
  onCancel: () => void
}

export function ImageCropper({ imageUrl, onCrop, onCancel }: ImageCropperProps) {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const containerSize = 256

  const getConstrainedPosition = (x: number, y: number, zoomLevel: number) => {
    if (!imageRef.current) return { x, y }
    const scale = Math.max(
      containerSize / imageRef.current.naturalWidth,
      containerSize / imageRef.current.naturalHeight,
    )
    const currentW = imageRef.current.naturalWidth * scale * zoomLevel
    const currentH = imageRef.current.naturalHeight * scale * zoomLevel
    const maxX = Math.max(0, (currentW - containerSize) / 2)
    const maxY = Math.max(0, (currentH - containerSize) / 2)
    return {
      x: Math.min(Math.max(x, -maxX), maxX),
      y: Math.min(Math.max(y, -maxY), maxY),
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return
    setPosition(getConstrainedPosition(e.clientX - dragStart.x, e.clientY - dragStart.y, zoom))
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
  }

  const handleZoomChange = (value: number[]) => {
    const newZoom = value[0]
    setZoom(newZoom)
    setPosition((prev) => getConstrainedPosition(prev.x, prev.y, newZoom))
  }

  const handleSave = () => {
    if (!imageRef.current) return
    const img = imageRef.current
    const scale = Math.max(containerSize / img.naturalWidth, containerSize / img.naturalHeight)
    const totalScale = scale * zoom
    const currentW = img.naturalWidth * totalScale
    const currentH = img.naturalHeight * totalScale

    const imgX = containerSize / 2 - currentW / 2 + position.x
    const imgY = containerSize / 2 - currentH / 2 + position.y

    const canvas = document.createElement('canvas')
    canvas.width = containerSize
    canvas.height = containerSize
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(
        img,
        -imgX / totalScale,
        -imgY / totalScale,
        containerSize / totalScale,
        containerSize / totalScale,
        0,
        0,
        containerSize,
        containerSize,
      )
      onCrop(canvas.toDataURL('image/jpeg', 0.95))
    }
  }

  let previewStyle = {}
  if (imageRef.current) {
    const scale = Math.max(
      containerSize / imageRef.current.naturalWidth,
      containerSize / imageRef.current.naturalHeight,
    )
    previewStyle = {
      width: imageRef.current.naturalWidth * scale * zoom,
      height: imageRef.current.naturalHeight * scale * zoom,
      transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 py-2 sm:py-4 animate-fade-in w-full">
      <div
        className="relative overflow-hidden rounded-full bg-black/50 cursor-move touch-none ring-4 ring-[#D4AF37]/20 shadow-2xl"
        style={{ width: containerSize, height: containerSize }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Original"
          className="hidden"
          onLoad={() => {
            setImageLoaded(true)
            setPosition({ x: 0, y: 0 })
            setZoom(1)
          }}
        />
        {imageLoaded && (
          <img
            src={imageUrl}
            alt="Preview Real-time"
            style={previewStyle}
            draggable={false}
            className="max-w-none pointer-events-none select-none transition-transform duration-75"
          />
        )}
        <div className="absolute inset-0 pointer-events-none border-[3px] border-[#D4AF37] rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] z-10" />
        <div className="absolute inset-0 pointer-events-none bg-black/20 mix-blend-multiply z-10 rounded-full" />
      </div>

      <div className="w-full max-w-[280px] sm:max-w-xs space-y-4">
        <p className="text-center text-[13px] text-muted-foreground font-medium mb-2">
          Arraste a imagem para centralizar na máscara.
        </p>
        <div className="flex items-center gap-4 bg-black/40 p-3.5 rounded-2xl border border-[#D4AF37]/20 shadow-inner">
          <ZoomOut className="w-4 h-4 text-[#D4AF37]/70 shrink-0" />
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.01}
            onValueChange={handleZoomChange}
            className="flex-1"
          />
          <ZoomIn className="w-4 h-4 text-[#D4AF37]/70 shrink-0" />
        </div>
      </div>

      <div className="flex w-full flex-col-reverse sm:flex-row justify-end gap-3 mt-2 sm:mt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto rounded-xl font-semibold h-11 px-6 border-border hover:bg-muted"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C69C6D] text-black font-bold rounded-xl gap-2 h-11 px-8 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all hover:scale-[1.02]"
        >
          <Crop className="w-[18px] h-[18px]" />
          Confirmar Corte
        </Button>
      </div>
    </div>
  )
}
