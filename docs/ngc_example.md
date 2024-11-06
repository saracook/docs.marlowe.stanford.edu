---
title: "Using NVIDIA NIM Containers"
toc: true
permalink: /ngc_example.html
customjs: ./assets/js/nim.js
---


We illustrate using [this
Llama 3.1 (8B) model](https://build.nvidia.com/meta/llama-3_1-8b-instruct?snippet_tab=Docker). 


### 1. Prerequisites

- **NVIDIA Developer Account:** Create an account if you don’t have one.

- **Apptainer Cache Directory:** Ensure your Apptainer cache directory is set up (instructions [here](/software/apptainer)).

### 2. Local Setup

- **Install Docker**: If not already installed, download and install [Docker Desktop](https://www.docker.com/) on your local machine. Ensure it is running.
- **Obtain API Key**: Get an API key for logging into NVIDIA GPU Cloud (NGC). Click on [Get API Key](https://build.nvidia.com/meta/llama-3_1-8b-instruct?snippet_tab=Python) at the top of the python code.


_optional: enter your projectID, API Key, and SUNetID below and click the Generate button to generate copy & paste commands with your information pre-filled_
<div class="form-row ">
  <div class="col-auto">
	<label class="sr-only" for="projectID">projectID</label>
	<input type="text" class="form-control form-control-lg" name="projectID" id="projectID" placeholder="projectID" />
</div>
	<div class="col-auto">
	<label class="sr-only" for="APIkey">API Key</label>
	<input type="text" class="form-control form-control-lg" name="APIkey" id="APIkey" placeholder="API Key" />
</div>
<div class="col-auto">
	<label class="sr-only" for="SUNetID">SUNetID</label>
	<input type="text" class="form-control form-control-lg" name="SUNetID" id="SUNetID" placeholder="SUNetID" />
  </div>
<div class="col-auto">
	<label class="sr-only" for="partition">partition</label>
	<input type="text" class="form-control form-control-lg" name="partition" id="partition" placeholder="partition" />
  </div>
  <div class="col-auto">
	<a class="btn btn-info generate" id="generateBtn" title="Generate Commands"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate!</a>
	<a class="btn btn-info generate" id="clearBtn" title="Clear">Clear</a>
  </div>
</div>


### 3. Download the Llama Image

The image is ~13GB

**1. Log into NGC**
```bash
docker login nvcr.io
```
**2. Pull the Llama Image**
```bash
docker pull nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
```
**3. Save the Image as a Tar File**
```bash
docker save nvcr.io/nim/meta/llama-3.1-8b-instruct:latest -o llama.tar
```

### 4. Upload Llama to Marlowe

Upload to your Marlowe project directory from your laptop/local machine. 

```bash
scp llama.tar [SUNetID]@login.marlowe.stanford.edu:/scratch/[projectID]
```
### 5. Convert the Image on Marlowe

Convert the image to a `.sif` file. This takes a while to complete but you only have to do it once. These commands are run on Marlowe on the file you uploaded in the previous step.

**1. Start in your project folder**
```bash
cd /scratch/[projectID]
```
**2. Load Apptainer**
```bash
ml load apptainer
```
**3. Convert the Tar File to a .sif File**
```bash
apptainer build llama.sif docker-archive://llama.tar
```

### 6. Run the Container

**1. Start an Interactive Queue**

This example uses 8GPUs. Note the node number on your command line prompt. For example, `[SUNetID]@login-n01$` is on n01.

```bash
srun --partition=[partition] --gres=gpu:8 --ntasks=1 --time=1:00:00 --pty /bin/bash
```
**2. Set Up Environment Variables**

```bash
export NGC_API_KEY=[APIkey]  # Fill in your API key
ml load apptainer
export LOCAL_NIM_CACHE=$PROJDIR/.cache/nim
mkdir -p "$LOCAL_NIM_CACHE"
```
**3. Run the Container**

This will take about ten minutes the first time.

```bash
apptainer run --nv \
 --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
 --env NGC_API_KEY=$NGC_API_KEY \
 llama.sif
```
### 7. Access the API Service
**1. Monitor the Output** 

Look for lines indicating the server has started.

```
INFO 2024-10-17 18:26:48.395 server.py:82] Started server process [394400]
INFO 2024-10-17 18:26:48.395 on.py:48] Waiting for application startup.
INFO 2024-10-17 18:26:48.409 on.py:62] Application startup complete.
INFO 2024-10-17 18:26:48.411 server.py:214] Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO 2024-10-17 18:27:10.522 httptools_impl.py:481] 127.0.0.1:37712 - "POST /v1/chat/completions HTTP/1.1" 200
```

**2. Connect to the Job Node**

Create another session on the node where the API is running, so that you can access it via `localhost:8000`. 

Log into Marlowe and SSH into the job node you noted in Step 6 (e.g., `ssh n01`) to access the API service.

### 8. Test the API

This is the moment you have been waiting for! 

**Sample API Call using Curl**

   ```bash
   curl -X 'POST' \
   'http://localhost:8000/v1/chat/completions' \
   -H 'accept: application/json' \
   -H 'Content-Type: application/json' \
   -d '{
      "model": "meta/llama-3.1-8b-instruct",
      "messages": [{"role":"user", "content":"Write a limerick about Marlowe GPU Cluster (31 DGXs)"}],
      "max_tokens": 64
   }'
   ```


JSON Output:

```json
{"id":"chat-b2f3244d98b647caaa0d32ca54ed57db","object":"chat.completion","created":1729214830,"model":"meta/llama-3.1-8b-instruct","choices":[{"index":0,"message":{"role":"assistant","content":"There once was a cluster so fine,\nMarlowe GPU's, with power divine,\nThirty-one DGXs to play,\n Made for work in a major way,\nApplied Math's problems did align."},"logprobs":null,"finish_reason":"stop","stop_reason":null}],"usage":{"prompt_tokens":28,"total_tokens":69,"completion_tokens":41}}
```

which contains:

```
There once was a cluster so fine,
Marlowe GPU's, with power divine,
Thirty-one DGXs to play,
Made for work in a major way,
Applied Math's problems did align.
```

Behold, the pinnacle of human achievement!