export default function Gallery() {
  return (
    <main style={{ padding: '120px 20px' }}>
      <h1>Our Gallery</h1>

      <div className="gallery-grid">
        <img src="/project1.jfif" alt="Project 1" />
        <img src="/project2.jfif" alt="Project 2" />
        <img src="/project3.jfif" alt="Project 3" />
      </div>
    </main>
  )
}