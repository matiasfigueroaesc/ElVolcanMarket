// Hook para cargar datos del backend en una página:
//   const { datos, cargando, error, recargar } = useCarga(() => listarProductos(), []);
// - datos: lo que devolvió la función (null mientras carga o si falló)
// - cargando: true hasta que llegue la respuesta
// - error: el ApiError si falló (por ejemplo, el backend está apagado)
// - recargar(): vuelve a pedir los datos (por ejemplo, después de eliminar)
// "deps" funciona igual que en useEffect: si cambia, se vuelve a cargar.
import { useCallback, useEffect, useState } from "react";

export function useCarga(cargar, deps = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: null });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Si la página se desmonta o cambian los deps antes de que llegue la respuesta,
    // se ignora: así no se pisa un resultado nuevo con uno antiguo.
    let vigente = true;
    setEstado((previo) => ({ ...previo, cargando: true, error: null }));
    cargar().then(
      (datos) => vigente && setEstado({ datos, cargando: false, error: null }),
      (error) => vigente && setEstado({ datos: null, cargando: false, error })
    );
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return { ...estado, recargar };
}
