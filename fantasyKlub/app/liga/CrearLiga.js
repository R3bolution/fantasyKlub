import { View, Text, TextInput, Button, StyleSheet, Alert, Modal } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Importa useNavigation
import { crearLiga, unirseLiga } from "../../database/consultas"; // Importa las funciones de consultas

export default function CrearUnirseLiga() {
  const [isCreating, setIsCreating] = useState(true);
  const [leagueName, setLeagueName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [userId, setUserId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // Estado para el mensaje de error
  const [showError, setShowError] = useState(false); // Estado para mostrar el error

  const navigation = useNavigation(); // Usa useNavigation para manejar la navegación

  useEffect(() => {
    const fetchUserId = async () => {
      const id = await AsyncStorage.getItem("userId");
      setUserId(id);
    };

    fetchUserId();
  }, []);

  const handleCreateLeague = async () => {
    if (leagueName.trim()) {
      try {
        const response = await crearLiga(leagueName, userId);

        if (response.LigaID) {
          console.log("Liga creada exitosamente:", response);
          navigation.navigate("InicioScreen"); // Redirige a la pantalla de inicio después de crear la liga
        }
      } catch (error) {
        console.error("Error al crear la liga:", error);
        alert("Hubo un error al crear la liga. Inténtalo de nuevo.");
      }
    } else {
      alert("Por favor, introduce un nombre para la liga.");
    }
  };

  const handleJoinLeague = async () => {
    if (joinCode.trim()) {
      try {
        const response = await unirseLiga(joinCode, userId);

        if (response.message) {
          console.log(response.message);
          navigation.navigate("InicioScreen"); // Redirigir a la pantalla de inicio
        }
      } catch (error) {
        console.error("Error al unirse a la liga:", error);
        setErrorMessage(error.message || "Ocurrió un error. Inténtalo de nuevo.");
        setShowError(true); // Mostrar el error
      }
    } else {
      alert("Por favor, introduce el código de la liga.");
    }
  };

  const handleCloseError = () => {
    setShowError(false); // Cerrar el modal de error
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        {userId ? `Tu ID es: ${userId}` : "Cargando ID..."}
      </Text>
      <Text style={styles.title}>
        {isCreating ? "Crear Liga" : "Unirse a una Liga"}
      </Text>

      {isCreating ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nombre de la liga"
            value={leagueName}
            onChangeText={setLeagueName}
          />
          <Button title="Crear" onPress={handleCreateLeague} />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Código de la liga"
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <Button title="Unirse" onPress={handleJoinLeague} />
        </View>
      )}

      <Button
        title={
          isCreating ? "¿Ya tienes una liga? Únete" : "¿Quieres crear una liga?"
        }
        onPress={() => setIsCreating(!isCreating)}
      />

      {/* Modal de error */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showError}
        onRequestClose={handleCloseError}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <Button title="Aceptar" onPress={handleCloseError} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
  },
});
