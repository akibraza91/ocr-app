import React from 'react'
import './Intro.css';
import './Tool.css';
import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import { Link, Element } from 'react-scroll';

// For pdf support library
import * as pdfjs from 'pdfjs-dist'
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()


const Intro = () => {
  const [imageFile, setImageFile] = useState(null);
  const [language, setLanguage] = useState('eng');  // by default language to be english
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyInfo, setKeyInfo] = useState({});
  const imageRef = useRef(null);
  const langRef = useRef(null);
  const [disable, setDisable] = useState(false);

  // Get image file from input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    // if(file.type === 'application/pdf'){
    //   const loadTask = pdfjs.getDocument(URL.createObjectURL(file));
      
    //   loadTask.promise
    //   .then((doc) => {
    //     const pages = doc.numPages;
        
    //     for(let i = 1; i <= pages; i++){
    //       doc.getPage(i).then((page) => {
    //         const textContent = page.getTextContent();

    //         textContent.then((txtContent) => {
    //           const text = txtContent.items.map(item => item.str).join('');
    //           console.log('Pdf text: ', text)
    //         })
    //       })
    //     }
    //   });
    // }
  }

  // Get language from select input
  const handleLanguageChange = (e) => {
    if(imageFile){
      setLanguage(e.target.value);
    }
  }

  // Get ocr text
  const getOcrResult = async () => {
    if(!imageFile){
      window.alert('Please select a file to perform OCR?');
      return;
    }

    setLoading(true);
    setDisable(true);
    const worker = createWorker(language, 1, {
      logger: m => {
        if(m.status === 'recognizing text'){
          setProgress(Math.floor(m.progress * 100));
        }
      }
    });

    const rs = (await worker).recognize(imageFile);
    const txt = (await rs).data.text;
    extractKeyInformation(txt);
    (await worker).terminate();
    setDisable(false);
  }

  // Extract key information from text
  const extractKeyInformation = (key) => {
    const nameRegex = /Name :\s*([A-Za-z]+)/i;
    const licenceRegex = /Licence No. :\s*([A-Z0-9-]+)/i;
    const dobRegex = /DOB:\s*(\d{2}\/\d{2}\/\d{4})/i;

    const nameMatch = key.match(nameRegex);
    const licenceMatch = key.match(licenceRegex);
    const dobMatch = key.match(dobRegex);

    setKeyInfo({
    name: nameMatch ? nameMatch[1] : 'Not found',
    licenceNumber: licenceMatch ? licenceMatch[1] : 'Not found',
    dob: dobMatch ? dobMatch[1] : 'Not found'
    });
  }

  // Apply loading color
  const applyLoadingColor = () => {
    if(progress < 100 || progress === 100){
    return '#fff7d6';
    }
  }

  // Clear all fields
  const handleClear = () => {
    setImageFile(null);
    imageRef.current.value = null
    setLanguage('eng');
    langRef.current.value = 'eng';
    setProgress(0);
    setLoading(false);
    setKeyInfo({});
  }

    
  return (
    <>
    <div id="hero">
      <div className="inner">
        <div className="content">
            <h1>Unlock Text from Images</h1>
            <p>Transform images into editable text effortlessly with our user-friendly OCR app. Using advanced AI technology, our app accurately extracts text, making data retrieval simple and efficient for your everyday needs.</p>
            <Link to="tool-section" smooth={true} duration={1000}>
              <span>Try it Out</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </Link>
        </div>
        <div className="image">
            <img src="/ocr_img.png" alt="Illustration" />
        </div>
      </div>
    </div>
    {/* ---------------Tool Section ---------------- */}
    <Element id='tool-section' name='tool-section'>
      <div className="container">
        <div className="heading">
          <h1>Try our Driving Licence Extractor</h1>
          <p>To get better results? please upload good quality image files.</p>
        </div>
        <div className='inner-container'>
          <div className="form">
              <label htmlFor="imageFile">
                  <span>Upload image file (.bmp, .jpg, .png, .pbm, .webp)</span>
                  <input ref={imageRef} type="file" name='imageFile' onChange={handleImageChange} />
              </label>
              <label htmlFor="languages">
                  <span>Language</span>
                  <select ref={langRef} name="languages" id="languageInput" onChange={handleLanguageChange}>
                      <option value="eng">English</option>
                      <option value="hin">Hindi</option>
                      <option value="urd">Urdu</option>
                  </select>
              </label>
              <div className="progressBar">
                  <span style={{width: `${progress}%`, backgroundColor: applyLoadingColor(), fontSize: '10px'}}>{progress}%</span>
              </div>
              <div className="buttons">
                  <input type="button" value={'Extract'} onClick={getOcrResult} disabled={disable} />
                  <input type="button" value={'Clear'} onClick={handleClear} />
              </div>
          </div>
          <div className="results">
              <h2>Results</h2>
              <div className="details">
                  <label htmlFor="name">
                      <span>Name :</span>
                      <input type="text" name='name' readOnly defaultValue={loading ? keyInfo.name : ''} />
                  </label>
                  <label htmlFor="licenceNum">
                      <span>Licence No :</span>
                      <input type="text" name='licenceNum' readOnly defaultValue={loading ? keyInfo.licenceNumber : ''}/>
                  </label>
                  <label htmlFor="dob">
                      <span>Date of Birth :</span>
                      <input type="text" name='dob' readOnly defaultValue={loading ? keyInfo.dob : ''} />
                  </label>
              </div>
          </div>
        </div>
      </div>
    </Element>
    </>
  )
}

export default Intro
