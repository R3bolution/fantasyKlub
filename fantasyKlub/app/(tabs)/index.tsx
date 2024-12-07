import { Tabs } from "expo-router";

export default function AppTabs() {
  return (
    <Tabs>
      <Tabs.Screen name="team-selection" options={{ title: "Select Team" }} />
      <Tabs.Screen name="my-team" options={{ title: "My Team" }} />
    </Tabs>
  );
}