import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {

  const [ busqueda, setBusqueda ] = useState('');

  const [ imagenes, guardarImagenes ] = useState([]);

  const [ paginaactual, setPaginaActual ] = useState(1);

  const [ totalpaginas, setTotalPaginas ] = useState(1);


  useEffect(() => {
    const consultarAPI = async () => {
      if(busqueda === '') return;

      const imagenesPorPagina = 30;
      const key = '19765272-fed286716141f385c90bfe689';
      const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

      const peticion = await fetch(url);
      const respuesta = await peticion.json();
      guardarImagenes(respuesta.hits);
      
      //calcular el total de paginas

      const calcularTotalPaginas = Math.ceil(respuesta.totalHits / imagenesPorPagina);

      setTotalPaginas(calcularTotalPaginas);

      //mover la pantalla hacia arriba

      const jumbotron = document.querySelector('.jumbotron');
      jumbotron.scrollIntoView({behavior: 'smooth'})

    }

    consultarAPI();
  }, [busqueda, paginaactual])

  //definir la pagina anterior

  const paginaAnterior = () => {
    const nuevaPaginaActual = paginaactual - 1;
    if(nuevaPaginaActual === 0) return;
    setPaginaActual(nuevaPaginaActual);
  }

  const paginaSiguiente = () => {
    const nuevaPaginaActual = paginaactual + 1;
    if(nuevaPaginaActual > totalpaginas) return;

    setPaginaActual(nuevaPaginaActual)
  }


  return (
    <div className="container">
      <div className="jumbotron">
        <p className="lead text-center">Buscador de Imágenes</p>
        <Formulario 
          setBusqueda={setBusqueda}
        />
      </div>

      <div className="row justify-content-center">
        <ListadoImagenes 
          imagenes={imagenes}
        />

        {(paginaactual === 1) ? null : (<button
          type="button"
          className="btn btn-info mr-3 mb-2"
          onClick={paginaAnterior}
        >&laquo; Anterior </button>)}

        {(paginaactual === totalpaginas) ? null : (
        <button 
          type="button"
          className="btn btn-info mb-2 ml-3"
          onClick={paginaSiguiente}
        >  Siguiente &raquo;</button>)}
      </div>
    </div>
  );
}

export default App;
