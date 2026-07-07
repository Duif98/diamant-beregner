import { StoreProvider } from "./components/Store";
import App from "./components/App";

export default function Page() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
