import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/atoms/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/atoms/ui/carousel"

export interface Slide {
    imageUrl: string
    title: string
    description: string
}

interface CarouselPluginProps {
    slides: Slide[]
}

export function CarouselPlugin({ slides }: CarouselPluginProps) {
    const plugin = React.useRef(Autoplay({ delay: 7000, stopOnInteraction: true }))

    return (
        <div className="flex flex-col w-full justify-center items-center">
            <Carousel
                opts={{ loop: true }}
                plugins={[plugin.current]}
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="p-0 relative">
                                <Card>
                                    <CardContent className="p-0 relative">
                                        <div className="aspect-square relative">
                                            <img
                                                src={slide.imageUrl}
                                                alt="Imagen del slide"
                                                className="h-full w-full object-cover  rounded-xl"
                                            />
                                            <div className="absolute bottom-10 left-8 bg-opacity-50 p-2 rounded-xl">
                                                <h3 className="text-white text-3xl font-bold">{slide.title}</h3>
                                                <p className="text-white text-xl w-8/12">{slide.description}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    )
}
