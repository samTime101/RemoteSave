import { Link } from "react-router-dom";
function Home() {
  return (
    <div className="list-group w-50 container mt-5">
      <h2>SHAREVER</h2>
      <h6>CV-Jan16 - REACT BOOTSTRAP frontend</h6>
      <p>COPYRIGHT : SAMIP REGMI</p>
      <Link to="/see" className="list-group-item list-group-item-action">
        List Spaces
      </Link>
      <Link
        to="/join"
        className="list-group-item list-group-item-action"
      >
        Join up a space
      </Link>
      <Link
        to="/createSpace"
        className="list-group-item list-group-item-action"
      >
        Create Space
      </Link>
      <Link
        to="/uploadcontent"
        className="list-group-item list-group-item-action"
      >
        Upload to Space
      </Link>
      <Link
        to="/adminlogin"
        className="list-group-item list-group-item-action"
      >
        Admin
      </Link>
    </div>
  );
}

export default Home;
