import axios from "axios";

// Configura la URL base de la API
const API_URL = "http://192.168.1.27:3000/api";

// Función para obtener las ligas de un usuario
export const getLigasPorUsuario = async (userId) => {
  try {
    const response = await axios.post(`${API_URL}/liga/ligasUsuarios`, { UsuarioID: userId });
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener las ligas");
  }
};

// Función para contar los participantes de una liga
export const contarParticipantes = async (ligaId) => {
  try {
    const response = await axios.post(`${API_URL}/liga/contarParticipantes`, { LigaID: ligaId });
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los participantes");
  }
};

// Función para crear una liga
export const crearLiga = async (leagueName, userId) => {
    try {
      const response = await axios.post(`${API_URL}/liga/crearLiga`, {
        Nombre: leagueName,
        UsuarioID: userId,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al crear la liga: " + error.message);
    }
  };
  
  // Función para unirse a una liga
  export const unirseLiga = async (joinCode, userId) => {
    try {
      const response = await axios.post(`${API_URL}/liga/unirseLiga`, {
        CodigoLiga: joinCode,
        UsuarioID: userId,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al unirse a la liga: " + error.message);
    }
};

export const obtenerPlantilla = async (usuarioLigaID) => {
    try {
      const response = await axios.post(`${API_URL}/equipo/plantilla`, {
        UsuarioLigaID: usuarioLigaID,
      });
      return response.data;  // Devuelve la plantilla de jugadores
    } catch (error) {
      throw new Error("Error al cargar los jugadores: " + error.message);
    }
};

// Función para obtener usuarios de la liga
export const obtenerUsuarios = async (ligaID) => {
    try {
      const response = await axios.post(`${API_URL}/liga/obtenerUsuarios`, { LigaID: parseInt(ligaID) });
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener los usuarios: " + error.message);
    }
  };
  
  // Función para obtener jornadas
  export const obtenerJornadas = async () => {
    try {
      const response = await axios.post(`${API_URL}/jornada/obtenerJornadas`);
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener las jornadas: " + error.message);
    }
  };
  
  // Función para obtener puntuaciones
  export const obtenerPuntuacion = async (usuarioLigaID, jornadaID, jornada) => {
    try {
      const response = await axios.post(`${API_URL}/liga/obtenerPuntuacion`, {
        UsuarioLigaID: usuarioLigaID,
        jornadaID: jornadaID,
        jornada: jornada,
      });
      return response.data;
    } catch (error) {
      throw new Error("Error al obtener la puntuación: " + error.message);
    }
  };


export const obtenerJugadoresPorJornada = async (
  usuarioLigaID,
  jornada,
  JornadaID
) => {
  try {
    const response = await axios.post(
      `${API_URL}/equipo/jugadorPorJornada`,
      {
        usuarioLigaID,
        jornada,
        JornadaID,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los jugadores:", error);
    return { jugadores: [] };
  }
};


export const obtenerJugadoresAlineados = async (usuarioLigaID) => {
  try {
    const response = await axios.post(
      `${API_URL}/equipo/alineacion`,
      {
        UsuarioLigaID: usuarioLigaID,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los jugadores alineados:", error);
    return [];
  }
};

export const obtenerJugadorPorID = async (usuarioLigaID, jugadorID) => {
  try {
    const response = await axios.post(
      `${API_URL}/equipo/obtenerJugador`,
      {
        UsuarioLigaID: usuarioLigaID,
        JugadorID: jugadorID,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los datos del jugador:", error);
    throw new Error(error.message || "Error al obtener los datos del jugador");
  }
};