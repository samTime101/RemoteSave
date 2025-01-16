import React, { useState, useRef } from "react";

function CreateSpace() {
  const [address] = useState("https://samip.pythonanywhere.com");
  const spacename = useRef();
  const password = useRef();
  const [details, setDetails] = useState([]);

  async function createSpace(event) {
    event.preventDefault(); 
    if (spacename.current.value.includes(' ')){
      alert('Invalid request , whitespaces is not allowed')
      return
    }
    try {
      const data = await fetch(`${address}/post/${spacename.current.value}/${password.current.value}`, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
      });

      const response = await data.text();
      console.log(response);
      
      if (data.status === 200) {
        setDetails(
<div
  className="alert alert-success alert-dismissible fade show d-flex align-items-center mt-2"
  role="alert"
>
  <svg xmlns="http://www.w3.org/2000/svg" style={{ display: "none" }}>
    <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
    </symbol>
  </svg>
  <svg
    className="bi flex-shrink-0 me-2"
    width={24}
    height={24}
    role="img"
    aria-label="Success:"
  >
    <use xlinkhref="#check-circle-fill" />
  </svg>
  <div>Success</div>
  <button
    type="button"
    className="btn-close"
    data-bs-dismiss="alert"
    aria-label="Close"
  />
</div>

        );
      } else {
        setDetails(<div>
          <svg
            style={{
              display: "none",
            }}
            xmlns="http://www.w3.org/2000/svg">
            <symbol
              fill="currentColor"
              id="exclamation-triangle-fill"
              viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </symbol>
          </svg>
          <div className="alert alert-danger d-flex align-items-center mt-3" role="alert">
            <svg
              aria-label="Danger:"
              className="bi flex-shrink-0 me-2"
              height="24"
              role="img"
              width="24">
              <use xlinkHref="#exclamation-triangle-fill" />
            </svg>
            <div>Error Response from Server</div>
          </div>
        </div>
        );
      }
    } catch (error) {
      console.log(error);
      setDetails(
        <div className="alert alert-danger" role="alert">
          Error , couldnot handle the reqeust
        </div>
      );
    }
  }

  return (
    <div className="container w-50 mt-5">
      <div className="mb-3">
        <label htmlFor="spacename" className="form-label">
          Space Name
        </label>
        <input
          type="text"
          className="form-control"
          id="spacename"
          name="spacename"
          ref={spacename}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          name="password"
          ref={password}
        />
      </div>
      <button
        type="button" 
        className="btn btn-primary"
        onClick={createSpace} 
      >
        Submit
      </button>

      <div id="details">
        {details}
      </div>
    </div>
  );
}

export default CreateSpace;
