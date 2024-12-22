# To-Dos

- [ ] PySpur Modules
  - [X] Parametric Prompts
  - [ ] Caching (like what Ryan did with Redis)
    - [ ] also caching of the graph, ie., only re-execute the parts of the workflow that changes between executions
  - [ ] Logging
  - [ ] Node-level evals
  - [ ] Batch Inference
  - [ ] Datasets Import
  - [ ] Evals
    - [ ] import benchmarks
    - [ ] build your own
  - [ ] Generative nodes
  - [ ] fine-tuning
  - [ ] build vs. inference-time graph view (for generative/dynamic graphs)
  - [ ] add llm.txt for system message (like fastHTML)
- [ ] Write tests

# Run backend
```sh
# Navigate to backend directory
cd /home/chris/repo/PySpur/backend

# Activate virtual environment
source venv/bin/activate

# Run uvicorn server
uvicorn app.api.main:app --host 0.0.0.0 --port 6080 --reload
# To stop server: Ctrl+C
```