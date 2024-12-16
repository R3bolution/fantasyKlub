import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
            headerShown: false,
        }}    
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          // tabBarIcon: () =>
        }}
      />
      <Tabs.Screen
        name="clasificacion"
        options={{
          title: "Clasificacion",
        }}
      />
      <Tabs.Screen
        name="equipo"
        options={{
          title: "Equipo",
        }}
      />
      <Tabs.Screen
        name="mercado"
        options={{
          title: "Mercado",
        }}
      />
      <Tabs.Screen
        name="actividad"
        options={{
          title: "Actividad",
        }}
      />
    </Tabs>
  );
}
