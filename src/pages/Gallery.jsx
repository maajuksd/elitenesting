// 
import { useEffect, useRef, useState } from "react";
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

const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);

export default function Gallery() {
  // First batch of images
  const [gallery, setGallery] = useState(shuffle(images));

  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Add another shuffled batch
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
    <main className="gallery-page">
      <div className="gallery-header">
        <img
          src="/logo.png"
          alt="Elite Nesting Logo"
          className="gallery-logo"
        />
        <h1>Our Interior Gallery</h1>
      </div>

      <div className="masonry">
        {gallery.map((img, index) => (
          <div className="item" key={index}>
            <img
              src={img}
              alt={`Interior ${index + 1}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Invisible trigger at the bottom */}
      <div ref={loaderRef} style={{ height: "50px" }}></div>
    </main>
  );
}