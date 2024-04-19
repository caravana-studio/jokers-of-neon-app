export const Home = () => {
  return (
    <>
      <div className="text">
        <span>AV-1</span>
      </div>
      <div className="menu">
        <header>Main Menu</header>
        <ul>
          <li className="active">
            <a href="/demo" title="">
              Play demo
            </a>
          </li>
          <li>
            <a href="#" title="">
              Picture
            </a>
          </li>{" "}
          <li>
            <a href="#" title="">
              Sound
            </a>
          </li>
          <li>
            <a href="#" title="">
              Contact
            </a>
          </li>
        </ul>
        <footer>
          {/*           <div className="key">
            Exit: <span>1</span>
          </div> */}
          <div className="key">
            Select: <span>ENTER</span>
          </div>
        </footer>
      </div>
    </>
  );
};
