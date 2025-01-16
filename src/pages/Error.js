import { Link } from "react-router-dom";

function Error() {
  return (
    <>
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="text-center">
          <h1 className="display-1 fw-bold">404</h1>
          <p className="fs-3">
            <span className="text-danger">SHAREVER!</span> Page not found.
          </p>
          <p className="lead">The page you are trying to access does not exist</p>
          <Link className="btn btn-primary" to="/">
            Go Home
          </Link>
        </div>
      </div>
      <p className="text-center mt-5">
        Error page design taken from{" "}
        <a href="https://frontendshape.com/post/bootstrap-5-404-page-examples" target="_blank" rel="noopener noreferrer">
          FrontendShape - Bootstrap 5 404 Page Examples
        </a>
      </p>
    </>
  );
}

export default Error;
