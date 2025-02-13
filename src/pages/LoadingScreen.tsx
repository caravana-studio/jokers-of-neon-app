import "../App.scss";
import { PreThemeLoadingPage } from "./PreThemeLoadingPage";

interface LoadingScreenProps {
  error?: boolean;
}

export const LoadingScreen = ({ error = false }: LoadingScreenProps) => {
  return (
    <PreThemeLoadingPage>
      {error ? (
        <div>error loading game</div>
      ) : (
        <>
          <img
            style={{ marginTop: "80px" }}
            width="60%"
            src="logos/logo.png"
            alt="logo"
          />
          <img src="loader.gif" alt="loader" width="100px" />
        </>
      )}
    </PreThemeLoadingPage>
  );
};
