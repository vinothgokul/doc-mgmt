from fastapi import FastAPI, Form
import time
import threading

app = FastAPI()

ingestion_status = {}

def simulated_ingestion(docID: int):
  ingestion_status[docID] = "Processing"
  time.sleep(5)
  ingestion_status[docID] = "Completed"

@app.post("/ingest/{docID}")
async def ingest_doc(docID: int):
  if(docID in ingestion_status):
    return {"message": "Document already being ingested", "status": ingestion_status[docID]}
  
  ingestion_status[docID] = "Pending"
  thread = threading.Thread(target=simulated_ingestion, args=(docID,))
  thread.start()

  return {"message": "Document ingestion started", "status": "Pending"}

@app.get("/ingestion_status/{docID}")
async def get_ingestion_status(docID: int):
  status = ingestion_status.get(docID, "Ingestion not started")
  return {"DocID": docID, "status": status}