import React, { useState, useEffect } from "react";

function See() {
  const address = "https://samip.pythonanywhere.com"
  const [list, setList] = useState([]);
  const [status, setStatus] = useState("");
  const [details, setDetails] = useState([]);
  const [spaceName, setSpaceName] = useState("");
  
  //suruma call garne
  useEffect(() => {fetchData();},[] );
  
  async function fetchData() {
    try {
      const response = await fetch(`${address}/list`);
      const data = await response.json();
      setList(data);
    } catch (error) {
      setList([
        "ASK SAMIP TO TURN ON SERVER",
        "THE SERVER IS CURRENTLY SWITCHED OFF",
      ]);
    }
  }

  async function join(space) {
    setSpaceName(space);
    const response = await fetch(`${address}/space/${space}`);
    const data = await response.json();

    if (response.ok) {
      setStatus(`CONNECTED TO ${space}`);
      setDetails(data);
    } else {
      setDetails(["ERROR: THE SPACE DOES NOT EXIST"]);
      setStatus("");
    }
  }

  async function redirect(target) {
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
    <div className="list-group w-50 container mt-5">
      <h2>SHARE VER</h2>
      <p>COPYRIGHT: SAMIP REGMI</p>
      <div id="list">
        {list.map((item, index) => (
          <a
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => join(item)}
          >
            {item}
          </a>
        ))}
      </div>
      <br />
      <div id="status">{status}</div>
      <br />
      <div id="details" className="mb-5">
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

export default See;
