import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {IoLocationSharp, IoBriefcaseOutline} from 'react-icons/io5'
import {FaStar, FaExternalLinkAlt} from 'react-icons/fa'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobData: []}

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
          skills: data.job_details.skills.map(eachSkill => ({
            name: eachSkill.name,
            imageUrl: eachSkill.image_url,
          })),
        },
        similarJobs: data.similar_jobs.map(eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        })),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobData: updatedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoading = () => (
    <div className="failure-page-container" data-testid="loader">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div className="failure-page-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSimilarJobs = eachJob => {
    console.log(eachJob)
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = eachJob
    return (
      <>
        <div className="job-card-bg">
          <div className="job-container">
            <img
              src={companyLogoUrl}
              alt="similar job company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title">{title}</h1>
              <div className="flex">
                <FaStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="description-container">
            <h1 className="job-description-title">Description</h1>
          </div>
          <p>{jobDescription}</p>
          <div className="flex space-between">
            <div className="flex">
              <div className="flex location-ele">
                <IoLocationSharp className="job-card-icon" />
                <p>{location}</p>
              </div>
              <div className="flex">
                <IoBriefcaseOutline className="job-card-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
        </div>
      </>
    )
  }

  renderSuccess = () => {
    const {jobData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobData.jobDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <>
        <div className="job-card-bg">
          <div className="job-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />
            <div className="title-rating-container">
              <h1 className="title">{title}</h1>
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
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-container">
            <h1 className="job-description-title">Description</h1>
            <div className="visit-container">
              <a
                className="visit-title"
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
              >
                Visit
              </a>
              <FaExternalLinkAlt />
            </div>
          </div>
          <p>{jobDescription}</p>
          <h1 className="skills-title">Skills</h1>
          <div>
            <ul className="skills-container">
              {skills.slice(0, 5).map(eachSkill => (
                <li className="skill-container" key={eachSkill.name}>
                  <img
                    src={eachSkill.imageUrl}
                    alt={eachSkill.name}
                    className="skill-img"
                  />
                  <p className="skill-title">{eachSkill.name}</p>
                </li>
              ))}
            </ul>
            <div className="life-at-container">
              <div>
                <h1 className="description">Life at Company</h1>
                <p>{description}</p>
              </div>
              <img src={imageUrl} alt="life at company" />
            </div>
          </div>
        </div>
        <div>
          <h1>Similar Jobs</h1>
          <ul className="similar-jobs-container">
            {jobData.similarJobs.map(eachJob => (
              <li className="similar-jobs-card" key={eachJob.id}>
                <Link to={`/jobs/${eachJob.id}`}>
                  {this.renderSimilarJobs(eachJob)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  jobDetailsPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      case apiStatusConstants.failure:
        return this.renderFailure()
      case apiStatusConstants.success:
        return this.renderSuccess()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-item-bg">{this.jobDetailsPage()}</div>
      </>
    )
  }
}

export default JobItemDetailsRoute
