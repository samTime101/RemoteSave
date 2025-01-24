import React, { useEffect, useState , useRef } from "react";
import { Link } from "react-router-dom";
import { Modal } from "bootstrap";
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

  const password = useRef();
  const content = useRef();
  const modal_warning = useRef();
  
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
      } else {
        alert("Invalid admin password or error deleting space");
      }
    });
  };
  const editFile = async (spaceName,fileName)=>{
    const warningModal = new Modal(modal_warning.current);
    warningModal.show();
    var data_get = await fetch(
      `${addressGet}/space/${spaceName}/${fileName}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  
    var response_data = await data_get.text();
    content.current.value = response_data
    setTargetedFileName(fileName)
  }
  const send = async ()=>{
    if(!password.current.value || !content.current.value){
      return
    }  
    var data_new = await fetch(`${addressPost}/edit/${spaceName}/${password.current.value}/${targetedFileName}`, {
      method: "POST",
      headers: {
          "Content-Type": "text/plain"
      },
      body: `${content.current.value}`
  });
  var response_new = await data_new.text(); 
  alert(data_new.status)
  const warningModal = new Modal(modal_warning.current);
  warningModal.hide();
  }
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
                <li key={item} className="list-group-item d-flex flex-row justify-content-between align-items-center">
                  <Link
                    onClick={() => redirectToFile(item)}
                    className="text-decoration-none text-dark"
                  >
                    {item}
                  </Link>
                  <div>
                  <button onClick={()=>editFile(spaceName,item)} className="btn btn-primary btn-sm me-2" data-toggle="modal" data-target="#warningModal">✏️</button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteFile(spaceName, item)}
                  >
                    X
                  </button> 
                  </div>
                </li>
              ))}
            </ul>
          </div>
      <div className="modal fade" id="warningModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modal_warning}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">New message</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <form>
              <div className="mb-3">
                <label htmlFor="pass-name" className="col-form-label">Password</label>
                <input type="password" className="form-control" id="pass-name" required  ref={password}/>
              </div>
              <div className="mb-3">
                <label htmlFor="message-text" className="col-form-label">Message:</label>
                <textarea className="form-control" id="message-text" rows="7" required ref={content}></textarea>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" id="newSend" className="btn btn-primary" onClick={send}>Send message</button>
          </div>
        </div>
      </div>
    </div>
        </>
      )}
    </div>
  );
};

export default AdminPage;
