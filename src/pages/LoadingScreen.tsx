import "../App.scss";

interface LoadingScreenProps {
  error?: boolean;
}

export const LoadingScreen = ({ error = false }: LoadingScreenProps) => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "Orbitron",
        fontSize: 30,
        letterSpacing: "0.25em",
        background: `url(bg/home-bg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        flexWrap: "wrap",
      }}
    >
      {error ? (
        <div>error loading game</div>
      ) : (
        <>
          <img style={{marginTop: '80px'}} width="70%" src="logo.jpg" alt="logo" />
          <img src="loader.gif" alt="loader" />
        </>
      )}
    </div>
  );
};
