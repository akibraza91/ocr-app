import React from 'react'
import './Features.css';

const Features = () => {
  return (
    <div id='features'>
      <div className="heading">
        <h1>We are Unique</h1>
        <p>Enhance your document and contact management lifecycle with Us..</p>
      </div>
      <div className="cards">
        <div className="card">
            <h3 className="title">Eficiency</h3>
            <p className="description">
                Enhancing operational efficiency by streamlining contract processes, automating repetitive tasks, and providing real-time analytics for informed decision-making. DocuVille's intuitive platform simplifies workflows and accelerates contract cycles.
            </p>
        </div>
        <div className="card">
            <h3 className="title">Security</h3>
            <p className="description">
                Ensuring data security and compliance with robust encryption protocols, secure cloud storage, and access controls. DocuVille prioritizes the protection of sensitive information, offering peace of mind to users regarding confidentiality and integrity.
            </p>
        </div>
        <div className="card">
            <h3 className="title">Integration</h3>
            <p className="description">
                Facilitating seamless integration with existing systems and third-party applications to optimize workflow continuity and data synchronization. DocuVille's flexible architecture enables easy collaboration and connectivity across platforms.
            </p>
        </div>
      </div>
    </div>
  )
}

export default Features
