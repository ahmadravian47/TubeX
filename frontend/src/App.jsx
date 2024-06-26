import { useState } from 'react'
import React from 'react'
import ReactDOM from 'react-dom'
import './App.css'
import axios from 'axios'
function App() {
  const [form, setform] = useState({
    title: "",
    description: "",
    file: null
  })


  function handleChange(event) {
    const inputValue = event.target.name === "file" ? event.target.files[0] : event.target.value;
    setform({ ...form, [event.target.name]: inputValue })
  }


  // function handlesubmit(event) {
  //   event.preventDefault();
  //   const videoData = new FormData();
  //   videoData.append("videoFile", form.file); 
  //   videoData.append("title", form.title); 
  //   videoData.append("descriptionn", form.description);
  //   // https://tube-x.vercel.app/
  //    axios.post("https://tube-x.vercel.app/upload", videoData) 
  //     .then(response => {
  //       console.log(response.data);
  //     })
  
  // }

  function handlesubmit(event) {
    event.preventDefault();
    const videoData = new FormData();
    videoData.append('videoFile', form.file);
    videoData.append('title', form.title);
    videoData.append('description', form.description);

    axios.post('https://tube-x.vercel.app/upload', videoData)
      .then(response => {
        if (response.data.authUrl) {
          window.location.href = response.data.authUrl;
        }
      })
      .catch(error => {
        console.error('Error uploading video:', error);
      });
  }

  return (
    <>
      <div>
        <h1>Upload Youtube Video</h1>
        <form onSubmit={handlesubmit}>
          <div>
            <input type="text" name="title" onChange={handleChange} autoComplete="off" placeholder="Title" />
          </div>
          <div>
            <textarea type="text" name="description" onChange={handleChange} autoComplete="off" placeholder='Description' />
          </div>
          <div>
            <input type="file" name="file" onChange={handleChange} accept='video/mp4' placeholder="Add Video File" />
          </div>
          <button type='submit'>Upload Video</button>
        </form>
      </div>
    </>
  )
}

export default App