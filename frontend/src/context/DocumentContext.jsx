import { createContext, useState, useEffect, useContext } from "react";
import { documentApi } from "../services/api";

const DocumentContext = createContext();

export function DocumentProvider({children}) {
  const [documents, setDocuments] = useState([]);
  const [fetched, setFetched] = useState(false);
  const [loading, setLoading] = useState(false)

  async function fetchDocuments() {
    if(fetched) return;
    setLoading(true)
    try {
      const response = await documentApi.getAllDocuments();
      setDocuments(response.data)
      setFetched(true)
    }
    catch(error) {
      console.error("Failed to fetch documents", error.response?.data || error.message);
    }
    finally{
      setLoading(false)
    }
  }

  async function uploadDocument(title, file) {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      const response = await documentApi.uploadDocument(formData);
      setDocuments([...documents, response.data]);
    }
    catch(error) {
      console.error("Failed to upload document", error.response?.data || error.message);
    }
  }

  return(
    <DocumentContext.Provider value={{ documents, loading, fetchDocuments ,uploadDocument}}>
      {children}
    </DocumentContext.Provider>
  )
}

export function useDocument() {
  return useContext(DocumentContext);
}