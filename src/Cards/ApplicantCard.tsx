
import React from 'react';
import { Applicant } from '../Data/dummyData';
interface ApplicantCardProps {
  applicant: Applicant;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ applicant }) => {
  return (
    <div className="applicant-card">
      <div className="applicant-content">
        <div className="applicant-info">
          <h2 style={{color:"green",marginLeft:4}}>{applicant.name}</h2>
          <p style={{marginLeft:4}}>{applicant.email}</p>
          <p style={{marginLeft:4}}>{applicant.snippet}</p>
          {applicant.date && <p>Date: {new Date(applicant.date).toLocaleString()}</p>}
        </div>
        {applicant.attachments.map((attachment, index) => (
          <div style={{margin:5,display:"flex",flexDirection:"column"}}>
          <button key={index} className='btnLink'>
            <a href={attachment.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
              View {attachment.filename}
            </a>
          </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicantCard;