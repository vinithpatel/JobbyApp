import {Link} from 'react-router-dom'
import {AiFillStar, AiTwotoneEnvironment} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const SimilarJobCard = props => {
  const {jobCardDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = jobCardDetails

  return (
    <li>
      <Link to={`/jobs/${id}`} className="nav-link">
        <div className="similar-job-card">
          <div className="job-card-logo-container">
            <img
              className="job-card-company-logo"
              src={companyLogoUrl}
              alt="similar job company logo"
            />
            <div className="job-card-name-card">
              <h1 className="job-card-title">{title}</h1>
              <div className="job-rating-card">
                <AiFillStar className="star-icn" />
                <p className="rating-para">{rating}</p>
              </div>
            </div>
          </div>
          <h1 className="desc-heading">Description</h1>
          <p className="job-card-desc">{jobDescription}</p>
          <div className="package-location-role-type-card">
            <div className="location-role-type-card">
              <div className="job-card-location-card">
                <AiTwotoneEnvironment className="location-icon" />
                <p className="location-para">{location}</p>
              </div>
              <div className="job-card-location-card">
                <BsFillBriefcaseFill className="location-icon" />
                <p className="location-para">{employmentType}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SimilarJobCard
