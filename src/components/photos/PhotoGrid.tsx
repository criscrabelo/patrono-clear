import { Check } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockPhotos = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  url: `https://img.usecurling.com/p/400/300?q=landscape&seed=${i}`,
  date: 'Out 2025',
  size: '3.2 MB',
  selected: i % 4 === 0,
  category: i % 3 === 0 ? 'Screenshot' : 'Viagem',
}))

export function PhotoGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {mockPhotos.map((photo) => (
        <Card
          key={photo.id}
          className={`relative overflow-hidden group cursor-pointer border-2 transition-all ${photo.selected ? 'border-primary shadow-primary/20' : 'border-transparent hover:border-border'}`}
        >
          <div className="aspect-square relative">
            <img
              src={photo.url}
              alt="Photo"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-white text-xs font-medium">{photo.size}</span>
            </div>
          </div>
          {photo.selected && (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm">
              <Check className="h-3 w-3" />
            </div>
          )}
          <Badge
            variant="secondary"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm text-[10px]"
          >
            {photo.category}
          </Badge>
        </Card>
      ))}
    </div>
  )
}
