import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import "./Gallery.css";

const images = [
  "/br00.jfif",
  "/br01.jpg",
  "/br02.jpg",
  "/br03.jpg",
  "/br04.jpg",
  "/br05.jfif",
  "/kt00.jfif",
  "/kt01.jfif",
  "/kt02.jfif",
  "/kt03.jfif",
  "/kt04.jpg",
  "/vanity00.jfif",
  "/vanity01.jpg",
  "/vanity02.jfif",
  "/vanity03.jpg",
  "/wr00.jfif",
  "/wr01.jfif",
  "/wr02.jfif",
  "/wr03.jfif",
];

const imageDescriptions = {
  "/br00.jfif": "Modern bedroom interior designed by Elite Nesting",
  "/br01.jpg": "Luxury bedroom interior in Kerala",
  "/br02.jpg": "Contemporary bedroom design",
  "/br03.jpg": "Premium bedroom with custom furniture",
  "/br04.jpg": "Elegant bedroom interior",
  "/br05.jfif": "Minimal bedroom design",

  "/kt00.jfif": "Modern modular kitchen by Elite Nesting",
  "/kt01.jfif": "Luxury modular kitchen interior",
  "/kt02.jfif": "Contemporary kitchen design",
  "/kt03.jfif": "Custom modular kitchen",
  "/kt04.jpg": "Premium kitchen interior",

  "/vanity00.jfif": "Designer vanity unit",
  "/vanity01.jpg": "Modern bathroom vanity",
  "/vanity02.jfif": "Luxury vanity design",
  "/vanity03.jpg": "Custom vanity interior",

  "/wr00.jfif": "Walk-in wardrobe by Elite Nesting",
  "/wr01.jfif": "Modern wardrobe design",
  "/wr02.jfif": "Luxury wardrobe interior",
  "/wr03.jfif": "Custom wardrobe storage solution",
};

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Gallery() {
  const [gallery, setGallery] = useState(shuffle(images));

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setGallery((prev) => [...prev, ...shuffle(images)]);
        }
      },
      {
        threshold: 1,
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          Gallery | Elite Nesting Interior Design Projects
        </title>

        <meta
          name="description"
          content="Explore Elite Nesting's portfolio of premium interior design projects including bedrooms, modular kitchens, wardrobes, vanity units and custom interiors across Kerala."
        />

        <meta
          name="keywords"
          content="Interior Design Gallery Kerala, Bedroom Interior, Modular Kitchen, Wardrobe Design, Vanity Design, Elite Nesting"
        />

        <meta name="robots" content="index,follow" />

        <link
          rel="canonical"
          href="https://www.elitenesting.com/gallery"
        />

        <meta
          property="og:title"
          content="Elite Nesting Gallery"
        />

        <meta
          property="og:description"
          content="Browse our completed interior design projects."
        />

        <meta
          property="og:image"
          content="https://www.elitenesting.com/og-image.jpg"
        />

        <meta
          property="og:url"
          content="https://www.elitenesting.com/gallery"
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:card"
          content="summary_large_image"
        />
      </Helmet>

      <main className="gallery-page">
        <div className="gallery-header">
          <img
            src="/logo.png"
            alt="Elite Nesting Interior Design Company Logo"
            className="gallery-logo"
          />

          <h1>Our Interior Gallery</h1>
        </div>

        <div className="masonry">
          {gallery.map((img, index) => (
            <div className="item" key={index}>
              <img
                src={img}
                alt={imageDescriptions[img] || "Interior design project by Elite Nesting"}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div ref={loaderRef} style={{ height: "50px" }} />
      </main>
    </>
  );
}