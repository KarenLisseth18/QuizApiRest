import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/libros';

function App() {
  const [libros, setLibros] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargarLibros = async () => {
    try {
      const respuesta = await fetch(API_URL);

      if (!respuesta.ok) {
        throw new Error('No se pudieron consultar los libros.');
      }

      const datos = await respuesta.json();
      setLibros(datos);
      setError('');
    } catch {
      setError('No se pudo conectar con el servidor. Verifica que Spring Boot esté funcionando.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  const agregarLibro = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const respuesta = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, autor }),
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || 'No se pudo agregar el libro.');
      }

      setTitulo('');
      setAutor('');
      setMensaje('¡Tu libro se agregó correctamente!');
      await cargarLibros();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al agregar el libro.');
    }
  };

  const eliminarLibro = async (id) => {
    setMensaje('');
    setError('');

    try {
      const respuesta = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!respuesta.ok) {
        throw new Error(
          respuesta.status === 404
            ? 'El libro no existe.'
            : 'No se pudo eliminar el libro.'
        );
      }

      setMensaje('El libro se eliminó correctamente.');
      await cargarLibros();
    } catch (err) {
      setError(err.message || 'Ocurrió un error al eliminar el libro.');
    }
  };

  return (
    <div className="biblioteca">
      <header className="encabezado">
        <div className="barra-superior">
          <a className="marca" href="#inicio">
            <span className="marca-icono">B</span>
            <span>Casa de Letras</span>
          </a>

          <span className="estado">
            <span className="estado-punto"></span>
            Biblioteca digital
          </span>
        </div>

        <div className="portada" id="inicio">
          <div className="portada-texto">
            <span className="etiqueta">UN ESPACIO PARA LEER</span>
            <h1>Historias que<br />merecen ser <em>recordadas.</em></h1>
            <p>
              Organiza tus libros favoritos, descubre nuevas historias
              y construye tu propia colección.
            </p>
            <a className="boton-portada" href="#coleccion">
              Explorar colección <span>↓</span>
            </a>
          </div>

          <div className="ilustracion-libros" aria-hidden="true">
            <div className="sol"></div>
            <div className="libro libro-uno"><span>LAS HISTORIAS</span></div>
            <div className="libro libro-dos"><span>DE SIEMPRE</span></div>
            <div className="libro libro-tres"><span>Y LAS NUEVAS</span></div>
            <div className="flor">✳</div>
          </div>
        </div>
      </header>

      <main className="contenido">
        <section className="resumen">
          <div>
            <span className="subtitulo">TU RINCÓN LITERARIO</span>
            <h2>Una colección hecha a tu medida</h2>
          </div>
          <div className="contador">
            <span className="contador-numero">{libros.length}</span>
            <span className="contador-texto">libros en<br />tu colección</span>
          </div>
        </section>

        {mensaje && (
          <div className="aviso aviso-exito" role="status">{mensaje}</div>
        )}
        {error && (
          <div className="aviso aviso-error" role="alert">{error}</div>
        )}

        <div className="paneles">
          <section className="panel formulario-panel">
            <div className="panel-titulo">
              <span className="icono-panel">＋</span>
              <div>
                <span className="subtitulo">NUEVA INCORPORACIÓN</span>
                <h3>Agregar un libro</h3>
              </div>
            </div>

            <p className="texto-panel">
              ¿Qué historia vamos a guardar hoy?
            </p>

            <form onSubmit={agregarLibro}>
              <label htmlFor="titulo">Título del libro</label>
              <input
                id="titulo"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. El principito"
                required
              />

              <label htmlFor="autor">Nombre del autor</label>
              <input
                id="autor"
                type="text"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                placeholder="¿Quién lo escribió?"
                required
              />

              <button className="boton-agregar" type="submit">
                Agregar a mi colección <span>↗</span>
              </button>
            </form>

            <div className="nota-formulario">
              <span>✦</span> Cada libro guarda una historia especial.
            </div>
          </section>

          <section className="panel coleccion-panel" id="coleccion">
            <div className="coleccion-encabezado">
              <div>
                <span className="subtitulo">ESTANTERÍA PERSONAL</span>
                <h3>Mis libros</h3>
              </div>
              <span className="etiqueta-cantidad">
                {libros.length} {libros.length === 1 ? 'libro' : 'libros'}
              </span>
            </div>

            {cargando ? (
              <p className="estado-vacio">Cargando tu colección...</p>
            ) : libros.length === 0 ? (
              <div className="estado-vacio">
                <span className="vacio-icono">▤</span>
                <h4>Tu estantería está esperando</h4>
                <p>Agrega tu primer libro y empieza tu colección.</p>
              </div>
            ) : (
              <div className="lista-libros">
                {libros.map((libro, indice) => (
                  <article className="libro-item" key={libro.id}>
                    <div className={`libro-portada portada-${indice % 4}`}>
                      <span>LIBRO</span>
                      <strong>{String(indice + 1).padStart(2, '0')}</strong>
                    </div>

                    <div className="libro-info">
                      <span className="libro-id">EJEMPLAR N.º {libro.id}</span>
                      <h4>{libro.titulo}</h4>
                      <p>{libro.autor}</p>
                    </div>

                    <button
                      className="boton-eliminar"
                      type="button"
                      onClick={() => eliminarLibro(libro.id)}
                      aria-label={`Eliminar ${libro.titulo}`}
                      title="Eliminar libro"
                    >
                      ×
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <footer className="pie">
          <span>Casa de Letras</span>
          <span>Un libro, un mundo por descubrir.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;