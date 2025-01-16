import React, { useState, useRef } from "react";

function Join() {
  const [address] = useState("https://samip.pythonanywhere.com");
  const inputRef = useRef();
  const [status, setStatus] = useState("");  
  const [details, setDetails] = useState([]);

  async function join() {
    const spaceName = inputRef.current.value;

    try {
      const response = await fetch(`${address}/space/${spaceName}`);
      const data = await response.json();

      if (response.ok) {
        setStatus(`CONNECTED TO ${spaceName}`);
        setDetails(data);
      } else {
        setStatus("ERROR: THE SPACE DOES NOT EXIST");
        setDetails([]);
      }
    } catch (error) {
      setStatus("Error");
      setDetails([]);
    }
  }
  async function redirect(target) {
    const spaceName = inputRef.current.value;
    const targetedFileName = target;
    const response = await fetch(
      `${address}/space/${spaceName}/${targetedFileName}`,
    );
    const responseData = await response.text();

    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(`<pre>${responseData}</pre>`);
      newWindow.document.close();
    } else {
      console.error("POP UP ERROR");
    }
  }
  return (
    <div className="container w-50 mt-5">
      <div className="input-group mb-3">
        <input
          id="join_space"
          type="text"
          className="form-control"
          placeholder="Space name"
          aria-describedby="button-addon2"
          ref={inputRef}
        />
        <button
          onClick={() => join()}
          className="btn btn-outline-secondary"
          type="button"
          id="button-addon2"
        >
          Join
        </button>
      </div>
      <div id="status">{status}</div>
      <div id="details">
        {details.map((item, index) => (
          <a
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => redirect(item)}
          >
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Join;
