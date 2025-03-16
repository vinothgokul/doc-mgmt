from fastapi import FastAPI, Body
import time
import threading

app = FastAPI()

ingestion_status = {}
qa_db = {
  "Hi": "Hello bud!",
  "Explain the doc": "The document looks nice"
}

def simulated_ingestion(docID: int):
  ingestion_status[docID] = "Processing"
  time.sleep(5)
  ingestion_status[docID] = "Completed"

  time.sleep(5)
  del ingestion_status[docID]

@app.post("/ingest/{docID}")
async def ingest_doc(docID: int):
  ingestion_status[docID] = "Pending"
  
  thread = threading.Thread(target=simulated_ingestion, args=(docID,))
  thread.start()

  return {"message": "Document ingestion started", "status": "Pending"}

@app.get("/ingestion_status/{docID}")
async def get_ingestion_status(docID: int):
  status = ingestion_status.get(docID, "Ingestion not started")
  return {"DocID": docID, "status": status}

@app.post("/ask")
async def ask_question(payload: dict = Body(...)):
  question = payload.get("question")
  if not question:
    return {"error" : "Question is required"}
  answer = qa_db.get(question, "It's a good question...")
  return {"question": question, "answer": answer}