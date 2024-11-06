---
title: "Using NVIDIA NIM Containers"
toc: false
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


### 3. Downloading the Llama Image

1. **Log into NGC**:
   ```bash
   docker login nvcr.io
   ```
2. **Pull the Llama Image**:
   ```bash
   docker pull nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
   ```
3. **Save the Image as a Tar File**:
   ```bash
   docker save nvcr.io/nim/meta/llama-3.1-8b-instruct:latest -o llama.tar
   ```

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

6. Upload to Marlowe project directory from your laptop/local machine. 

```bash
scp llama.tar [SUNetID]@login.marlowe.stanford.edu:/scratch/[projectID]
```

7. Log in to Marlowe and convert the image to a `.sif` file. This takes a while to complete and is done once. 

```bash
cd /scratch/[projectID]
```

```bash
ml load apptainer
```

```bash
apptainer build llama.sif docker-archive://llama.tar
```

8. Run an interactive queue on the partition provided for you. We use 8 GPUs in our example. 

Note the node number on your command line prompt. For example, `[SUNetID]@login-n01$` is on n01.


```bash
srun --partition=[partition] --gres=gpu:8 --ntasks=1 --time=1:00:00 --pty /bin/bash
```

9. Run the container on your node (see step 8); this will take about 10 minutes the first time. 

Note the use of the API Key from step 2 which can be set up once in your `~/.bash_profile` for convenience. 

```bash
export NGC_API_KEY=[APIkey] 
ml load apptainer
export LOCAL_NIM_CACHE=$PROJDIR/.cache/nim
mkdir -p "$LOCAL_NIM_CACHE"
apptainer run --nv \
  --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
  --env NGC_API_KEY=$NGC_API_KEY \
  llama.sif
```
