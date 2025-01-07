import React, { useEffect, useState } from 'react';
import { View, Text, Alert, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Clasificacion = () => {
  const [clasificaciones, setClasificaciones] = useState([]);

  useEffect(() => {
    const fetchClasificacionGeneral = async () => {
      try {
        // Paso 1: Obtener los usuarios de la liga
        const usuariosResponse = await axios.post('http://192.168.1.27:3000/api/liga/obtenerUsuarios', {
          LigaID: 1, // Ajustar LigaID según sea necesario
        });
        const usuarios = Array.isArray(usuariosResponse.data) ? usuariosResponse.data : [];

        if (usuarios.length === 0) {
          Alert.alert('Error', 'No se encontraron usuarios en esta liga.');
          return;
        }

        // Paso 2: Obtener cuántas jornadas existen
        const jornadasResponse = await axios.post('http://192.168.1.27:3000/api/jornada/obtenerJornadas');
        const jornadas = Array.isArray(jornadasResponse.data) ? jornadasResponse.data : [];

        if (jornadas.length === 0) {
          Alert.alert('Error', 'No se encontraron jornadas.');
          return;
        }

        let clasificacionesAcumuladas = [];

        // Paso 3: Recorrer los usuarios y jornadas para calcular la puntuación
        for (const usuario of usuarios) {
          let totalPuntos = 0;
          let tienePuntos = false;

          for (const jornada of jornadas) {
            const jornadaID = jornada.jornada;

            try {
              // Obtener puntuación de la jornada específica para el usuario
              const puntuacionResponse = await axios.post('http://192.168.1.27:3000/api/liga/obtenerPuntuacion', {
                jornadaID,
                UsuarioLigaID: usuario.UsuarioLigaID,
                jornada: jornadaID,
              });

              const puntuaciones = puntuacionResponse.data;

              // Si en la jornada no hay al menos 3 jugadores, cuenta como 0
              if (puntuaciones.length < 3) {
                console.log(`Jornada ${jornadaID} puntuada con 0 para UsuarioLigaID ${usuario.UsuarioLigaID}: menos de 3 jugadores.`);
                continue;
              }

              // Sumar los puntos de la jornada al total del usuario
              totalPuntos += puntuaciones.reduce((acc, item) => acc + item.puntos, 0);
              tienePuntos = true;
            } catch (error) {
              console.log(`Error al obtener puntuaciones para Jornada ${jornadaID} y UsuarioLigaID ${usuario.UsuarioLigaID}:`, error);
            }
          }

          // Si el usuario no tiene puntos, su total será 0
          if (!tienePuntos) {
            console.log(`Usuario ${usuario.UsuarioLigaID} no tiene puntuaciones válidas. Total puntos: 0`);
          }

          // Agregar al acumulado de clasificaciones, ahora con el nombre del usuario
          clasificacionesAcumuladas.push({
            usuarioLigaID: usuario.UsuarioLigaID,
            nombre: usuario.nombre || 'Sin nombre', // Asegurar que haya un valor de texto
            puntos: totalPuntos,
          });
        }

        // Ordenar las clasificaciones de mayor a menor por puntos
        clasificacionesAcumuladas.sort((a, b) => b.puntos - a.puntos);

        // Actualizar el estado con la clasificación acumulada
        setClasificaciones(clasificacionesAcumuladas);
      } catch (error) {
        console.error('Error al calcular la clasificación general:', error);
        Alert.alert('Error', 'No se pudo calcular la clasificación general.');
      }
    };

    fetchClasificacionGeneral();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clasificación General</Text>
      <Text style={styles.subtitle}>Resultados</Text>

      {clasificaciones.length > 0 ? (
        <FlatList
          data={clasificaciones}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.nombre}</Text>
              <Text style={styles.cell}>{String(item.puntos)}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No hay datos para mostrar.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    fontSize: 16,
  },
});

export default Clasificacion;
