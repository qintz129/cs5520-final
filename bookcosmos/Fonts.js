import { useFonts } from "expo-font";
import { PaytoneOne_400Regular } from "@expo-google-fonts/paytone-one";
import { Molengo_400Regular } from "@expo-google-fonts/molengo";
import { SecularOne_400Regular } from "@expo-google-fonts/secular-one";

export function useCustomFonts() {
  const [fontsLoaded] = useFonts({
    PaytoneOne_400Regular,
    Molengo_400Regular,
    SecularOne_400Regular,
  });

  return { fontsLoaded };
}
