// import logo from './logo.svg';
import './App.css';
import { useState, useRef } from 'react';
import { createWorker } from 'tesseract.js';


function App() {
  const [imageFile, setImageFile] = useState(null);
  const [language, setLanguage] = useState('eng');  // by default language to be english
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [keyInfo, setKeyInfo] = useState({});
  const imageRef = useRef(null);
  const langRef = useRef(null);

  // Get image file from file input
  const handleImageChange = (e) => {
    if(e.target.files){
      setImageFile(e.target.files[0]);
    }
  }

  // Get language from select input
  const handleLanguageChange = (e) => {
    if(imageFile){
      setLanguage(e.target.value);
    }
  } 

  // Get ocr text
  const getOcrResult = () => {
    if(!imageFile){
      window.alert('Please select an image file?');
      return;
    }

    setLoading(true);
    const worker = createWorker(language, 1, {
      logger: (m) => {
        if(m.status === 'recognizing text'){
          setProgress(Math.floor(m.progress * 100));
        }
      }
    });

    (async () => {
      const rs = (await worker).recognize(imageFile);
      const ocrText = (await rs).data.text;
      extractKeyInformation(ocrText);
      (await worker).terminate();
    })();
  }

  // Extract key information from OCR text
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

  const applyLoadingColor = () => {
    if(progress < 100 || progress === 100){
      return '#fff7d6';
    }
  }

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
    <div className="App">
      <div id="container">
        <div className="row">
          <label htmlFor="file">Upload image file (.bmp, .jpg, .png, .pbm, .webp)</label>
          <input type="file" name="file" onChange={handleImageChange} ref={imageRef}/>
        </div>
        <div className="row">
          <label htmlFor="languages">Language</label>
          <select name="languages" id="document_language" style={{outline: 'none'}} onChange={handleLanguageChange} ref={langRef}>
              <option value="eng">English</option>
              <option value="hin">Hindi</option>
              <option value="urd">Urdu</option>
              <option value="fra">French</option>
              <option value="deu">German</option>
          </select>
        </div>
        <div id="loader" style={{width: `${progress}%`, backgroundColor: applyLoadingColor()}}>{progress}%</div>
        <div id="buttons">
          <input type="button" value='Submit' onClick={getOcrResult} />
          <input type="button" value='Clear' onClick={handleClear} />
        </div>
      </div>
      <div id="results">
        <h2>Results</h2>
        <p id="name">Name : {loading ? keyInfo.name : ''}</p>
        <p id="licence">Licence number : {loading ? keyInfo.licenceNumber : ''}</p>
        <p id="dob">Date of birth : {loading ? keyInfo.dob : ''}</p>
      </div>
    </div>
  );
}

export default App;
