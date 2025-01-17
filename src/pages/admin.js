import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import { password_prompt } from './passprompt'; 
const AdminPage = () => {
  const navigate = useNavigate();
  const addressGet = "https://samip.pythonanywhere.com";
  const addressPost = "https://samip.pythonanywhere.com";  
  const [authenticated, setAuthenticated] = useState(false);
  const [spaces, setSpaces] = useState([]);
  const [spaceName, setSpaceName] = useState("");
  const [details, setDetails] = useState([]);
  const [status, setStatus] = useState("");
  const [targetedFileName, setTargetedFileName] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("authenticated") !== "true") {
      alert("Access denied. Please log in first.");
      navigate('/adminlogin')
    } else {
      setAuthenticated(true);
    }

    const fetchAddressData = async () => {
      fetchData();
    };

    fetchAddressData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await fetch(`${addressGet}/list`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const response = await data.json();
      setSpaces(response);
    } catch (error) {
      setSpaces([
        "ASK SAMIP TO TURN ON SERVER",
        "THE SERVER IS CURRENTLY SWITCHED OFF",
      ]);
    }
  };

  const joinSpace = async (space) => {
    setSpaceName(space);
    const data = await fetch(`${addressGet}/space/${space}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const response = await data.json();
    if (data.ok) {
      setStatus(`CONNECTED TO ${space}`);
      setDetails(response);
    } else {
      setDetails(["ERROR : THE SPACE DOES NOT EXIST"]);
    }
  };

  const redirectToFile = async (fileName) => {
    setTargetedFileName(fileName);
    const data = await fetch(
      `${addressGet}/space/${spaceName}/${fileName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await data.text();
    const newWindow = window.open("", "_blank");
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(`<pre>${responseData}</pre>`);
      newWindow.document.close();
    } else {
      console.error("POP UP ERROR");
    }
  };

  const deleteFile = (spaceName, targetedFileName) => {
    password_prompt("Enter admin pass", "Submit", async (pass) => {
      const data = await fetch(
        `${addressPost}/remove_file/${pass}/${spaceName}/${targetedFileName}`,
        {
          method: "POST",
        }
      );
      //file delete huda existing file refresh hunuparo
      const response = await data.text();
      if (data.status === 200) {
        alert("File deleted successfully");
        // setStatus("")
        // setDetails([])
        // fetchData()
        joinSpace(spaceName);
      } else {
        alert("Invalid admin password or error deleting file");
      }
    });
  };

  const deleteSpace = (spaceName) => {
    password_prompt("Enter admin pass", "Submit", async (pass) => {
      const data = await fetch(
        `${addressPost}/remove_space/${pass}/${spaceName}`,
        {
          method: "POST",
        }
      );
      //space delete huda status ra details clear hunuparo ra reload is required
      const response = await data.text();
      if (data.status === 200) {
        alert("Space deleted successfully");
        setStatus("")
        setDetails([])
        fetchData()
        // joinSpace(spaceName);
      } else {
        alert("Invalid admin password or error deleting space");
      }
    });
  };

  return (
    <div className="w-50 container mt-5">
      <h2 className="text-center mb-4">Admin Page</h2>
      {authenticated && (
        <>
          <div className="mb-4">
            <h4>Spaces</h4>
            <ul className="list-group">
              {spaces.map((space) => (
                <li key={space} className="list-group-item d-flex justify-content-between align-items-center">
                  <Link
                    onClick={() => joinSpace(space)}
                    className="text-decoration-none text-dark"
                  >
                    {space}
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteSpace(space)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div id="status" className="text-center mb-4">{status}</div>
          <div className="mb-3">
            <h4>Details</h4>
            <ul className="list-group">
              {details.map((item) => (
                <li key={item} className="list-group-item d-flex justify-content-between align-items-center">
                  <Link
                    onClick={() => redirectToFile(item)}
                    className="text-decoration-none text-dark"
                  >
                    {item}
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteFile(spaceName, item)}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
