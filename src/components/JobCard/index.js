import {Link} from 'react-router-dom'
import {IoLocationSharp, IoBriefcaseOutline} from 'react-icons/io5'
import {FaStar} from 'react-icons/fa'
import './index.css'

const JobCard = props => {
  const {jobItem} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    id,
    rating,
    title,
    packagePerAnnum,
  } = jobItem
  return (
    <Link to={`/jobs/${id}`}>
      <div className="job-card-bg">
        <div className="job-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title" key={title}>
              {title}
            </h1>
            <div className="flex">
              <FaStar className="star-icon" />
              <p>{rating}</p>
            </div>
          </div>
        </div>
        <div className="flex space-between">
          <div className="flex">
            <div className="flex location-ele">
              <IoLocationSharp className="job-card-icon" />
              <p>{location}</p>
            </div>
            <div className="flex">
              <IoBriefcaseOutline className="job-card-icon" />
              <p key={employmentType}>{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <h1 className="description-title">Description</h1>
        <p>{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobCard
