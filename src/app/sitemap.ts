import { MetadataRoute } from "next";

const BASE = "https://marketforge.digital";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,               lastModified: new Date(), changeFrequency: "daily",  priority: 1.0 },
    { url: `${BASE}/market`,   lastModified: new Date(), changeFrequency: "daily",  priority: 0.95 },
    { url: `${BASE}/jobs`,     lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${BASE}/skills`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/salary`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/career`,   lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${BASE}/research`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];
}
