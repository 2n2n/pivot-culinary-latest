import { useEffect } from "react";
import { useRouter } from "expo-router";

/**
 * AppIndexScreen - Initial app entry point
 *
 * This component handles the initial routing logic when the app starts.
 * Currently redirects all users to the auth flow.
 *
 * TODO: Implement authentication check here:
 * - If user is authenticated, redirect to /(application)/index
 * - If user is not authenticated, redirect to /(auth)/index
 */

function AppIndexScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(auth)/login");
  }, []);

  return null;
}

export default AppIndexScreen;
