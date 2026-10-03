import { Link } from "react-router-dom";
import { listarCategorias } from "../../data/categorias.js";
import { listarProductos } from "../../data/productos.js";
import { useCart } from "../../context/CartContext.jsx";
import ProductList from "../../components/ProductList.jsx";
import { useEffect } from "react";
import Carousel from "bootstrap/js/dist/carousel";

const BANNERS = [
  {
    img: "/img/banner-1.jpg",
    alt: "Gas licuado a domicilio en Chillán",
    titulo: "Gas licuado a domicilio en Chillán",
    texto: "Cilindros de 5, 11 y 15 kg, despachados directo a tu hogar o negocio.",
    ruta: "/productos",
    boton: "Ver productos",
  },
  {
    img: "/img/banner-2.jpg",
    alt: "Entrega rápida y segura",
    titulo: "Entrega rápida y segura",
    texto: "Cobertura en Chillán y comunas aledañas, con repartidores de confianza.",
    ruta: "/zonas-despacho",
    boton: "Ver zonas de despacho",
  },
  {
    img: "/img/banner-3.jpg",
    alt: "Más de 25 años de experiencia",
    titulo: "Más de 25 años de experiencia",
    texto: "Una empresa familiar de Chillán al servicio de tu hogar desde 1998.",
    ruta: "/nosotros",
    boton: "Conócenos",
  },
];

export default function Home() {
  const { agregar } = useCart();
  const destacados = listarProductos().slice(0, 6);

  useEffect(() => {
  const instancia = Carousel.getOrCreateInstance(document.getElementById("heroCarousel"), {
    ride: "carousel",
  });
  return () => instancia.dispose();
}, []);

  return (
    <>
      <h1 className="visually-hidden">El Volcán Market — Inicio</h1>

      <div id="heroCarousel" className="carousel slide">
        <div className="carousel-indicators">
          {BANNERS.map((b, i) => (
            <button
              key={b.img}
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="carousel-inner">
          {BANNERS.map((b, i) => (
            <div key={b.img} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={b.img}
                alt={b.alt}
                className="d-block w-100"
                style={{ height: 420, objectFit: "cover" }}
              />
              <div className="carousel-caption d-none d-md-block hero-caption">
                <h2 className="fw-bold">{b.titulo}</h2>
                <p>{b.texto}</p>
                <Link to={b.ruta} className="btn btn-primary">{b.boton}</Link>
              </div>
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button"
                data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button"
                data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      <section className="container py-5">
        <h2 className="mb-4">Categorías</h2>
        <div className="row g-4">
          {listarCategorias().map((c) => (
            <div key={c.id} className="col-6 col-lg-3">
              <Link to={`/categorias/${c.slug}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm text-center">
                  <img src={c.imagen} className="card-img-top p-3" alt={c.nombre} />
                  <div className="card-body">
                    <h3 className="h6 mb-0">{c.nombre}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-5">
        <h2 className="mb-4">Productos destacados</h2>
        <ProductList
          productos={destacados}
          onAgregar={(p) => agregar(p, 1)}
          encabezado="h3"
        />
      </section>
    </>
  );
}