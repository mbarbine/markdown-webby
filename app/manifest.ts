import { siteConfig } from "@/lib/platphorm/config"
import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "MDTree",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#22c55e",
    icons: [
      {
        src: "/icon-192.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/icon-512.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  }
}
