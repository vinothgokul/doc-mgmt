import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDocument } from "../context/DocumentContext";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [ingestStatus, setIngestStatus] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { fetchDocuments, loading, documents, uploadDocument, triggerIngestion, triggerStatus } = useDocument();

  useEffect(() => {
    fetchDocuments();
  }, [])

  const handleLogout = () => {
    logout();
    navigate('/login')
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!title || !file) {
      setMessage("Please provide a title and select a file!");

      setTimeout(() => {
        setMessage(null)
      }, 5000);
      return;
    }

    await uploadDocument(title, file);
    setTitle("");
    setFile(null);
  };

  const handleIngest = async (id, ingest) =>{
    setIngestStatus("Loading...");
    ingest === "trigger" ? await triggerIngestion(id) : await triggerStatus(id);
    console.log(documents.find(doc => doc.id === id));
    setIngestStatus(documents.find(doc => doc.id === id).triggerStatus);

    setTimeout(() => {
      setIngestStatus(null)
    }, 5000);
  }

  return (
    <>
      <div className="dashboard-container">
        <div className="container-header">
          <h2>Dashboard</h2>
          <div className="button-group">
            {user.role === "ADMIN" &&  
              <button type="button" onClick={()=>navigate('/users')}>Manage User</button>
            }
            <button type="button" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {(user.role === "ADMIN" || user.role === "EDITOR") &&
          <form className="upload-form" onSubmit={handleUpload}>
            <input
              type="text"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input type="file" onChange={handleFileChange} />
            <button type="submit" className="green-btn">Upload</button>
          </form>
        }

        {loading 
          ? <p>Loading Documents...</p>
          : documents.length === 0 
              ? <p>No Documents...</p> 
              : <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      {user.role === "ADMIN" &&
                        <>
                          <th>Actions</th>
                          <th>Status</th>
                        </>
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>
                        <td>{doc.title}</td>
                        {user.role === "ADMIN" &&
                          <>
                            <td>
                              <button type="button" onClick={() => handleIngest(doc.id, "trigger")}>Ingest</button>
                              <button type="button" onClick={() => handleIngest(doc.id, "status")}>Status</button>
                            </td>
                            <td>{ingestStatus ? ingestStatus : null}</td>
                          </>
                        }
                      </tr>
                    ))}
                  </tbody>
                </table>
        }
      </div>
      {message && <span className="error-container">{message}</span>}
    </>
  );
}
