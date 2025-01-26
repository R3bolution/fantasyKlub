import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { obtenerPlantilla } from "../../database/consultas";  // Importa la función de consultas

export default function VerPlantillaScreen() {
  const [usuarioLigaID, setUsuarioLigaID] = useState(null);  // Estado para almacenar el UsuarioLigaID
  const [nombre, setNombre] = useState(null);  // Estado para almacenar el UsuarioLigaID
  const [jugadores, setJugadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el UsuarioLigaID almacenado
        const storedUsuarioLigaID = await AsyncStorage.getItem('verJugador');
        setUsuarioLigaID(storedUsuarioLigaID);
        const storedNombre = await AsyncStorage.getItem('verNombre');
        setNombre(storedNombre);

        if (storedUsuarioLigaID) {
          // Llamar a la función que obtiene la plantilla de jugadores desde consultas.js
          const plantilla = await obtenerPlantilla(storedUsuarioLigaID);
          setJugadores(plantilla);  // Guardar los jugadores en el estado
        } else {
          setError("No se encontró el UsuarioLigaID.");
        }
      } catch (err) {
        setError("Error al cargar los jugadores.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);  // Ejecutar solo una vez al montar el componente

  return (
    <View style={styles.container}>
      {/* Mostrar UsuarioLigaID solo si está disponible */}
      {usuarioLigaID && (
        <Text>UsuarioLigaID: {usuarioLigaID}</Text>
      )}
      {nombre && (
        <Text>Nombre: {nombre}</Text>
      )}
      <Text>Plantilla</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <FlatList
          data={jugadores}
          keyExtractor={(item) => item.JugadorID.toString()}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.nombre}</Text>
              <Text>{item.deporte}</Text>
              <Text>{item.posicion}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
});
