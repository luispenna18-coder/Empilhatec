import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    remotePatterns: [
      // Ainda usado pela página de Locação (será migrado para imagens locais).
      {
        protocol: "https",
        hostname: "data.still.de",
      },
    ],
  },
};

export default nextConfig;
