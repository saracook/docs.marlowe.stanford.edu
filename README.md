This site is built with Jekyll - Quickstart is here: 
https://jekyllrb.com/docs/

```
bundle exec jekyll serve --incremental
```
Incremental is optional, but useful. It will regenerate the site on localhost for page-level changes, but changes to _config.yml or the files in _data/ will require a restart.
export NGC_API_KEY=api 
 ml load apptainer
 export LOCAL_NIM_CACHE=$PROJDIR/.cache/nim
 mkdir -p "$LOCAL_NIM_CACHE"
 apptainer run --nv \
   --bind "$LOCAL_NIM_CACHE:/opt/nim/.cache" \
   --env NGC_API_KEY=$NGC_API_KEY \
   llama.sif