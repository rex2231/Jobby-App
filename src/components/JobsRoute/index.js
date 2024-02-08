import {IoIosSearch} from 'react-icons/io'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Component} from 'react'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class JobsRoute extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    searchInput: '',
    userProfileDetails: '',
    employmentType: [],
    salaryRange: '',
    profileApiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getJobs()
    this.getProfile()
  }

  onLoading = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="white" height="50" width="50" />
    </div>
  )

  getJobs = async () => {
    const {searchInput, employmentType, salaryRange} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    // const apiUrl = 'https://apis.ccbp.in/obs'
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        rating: job.rating,
        title: job.title,
        packagePerAnnum: job.package_per_annum,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        jobsList: updatedData,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  searchInput = jobSearchInput => {
    if (jobSearchInput.key === 'Enter') {
      this.setState({searchInput: jobSearchInput.target.value}, this.getJobs)
    }
    this.setState({searchInput: jobSearchInput.target.value})
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    // const updatedJobsList = jobsList.filter(job =>
    //   job.title.toLowerCase().includes(searchInput.toLowerCase()),
    // )
    return (
      <>
        <div>
          <div>
            {jobsList.length > 0 ? (
              <ul className="jobs-list-container">
                {jobsList.map(job => (
                  <li key={job.id}>
                    <JobCard key={job.id} jobItem={job} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-jobs-container">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
                  alt="no jobs"
                />
                <h1>No Jobs</h1>
                <p>We could not find any jobs. Try other filters</p>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

  getProfile = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile/'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      this.setState({profileApiStatus: apiStatusConstants.success})
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({userProfileDetails: updatedData})
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onClickCheckbox = event => {
    const {value, checked} = event.target
    this.setState(prevState => {
      if (checked) {
        return {
          employmentType: [...prevState.employmentType, event.target.value],
        }
      }
      return {
        employmentType: prevState.employmentType.filter(type => type !== value),
      }
    }, this.getJobs)
  }

  onChangeSalary = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  renderUserProfile = () => {
    const {userProfileDetails} = this.state
    const {name, profileImageUrl, shortBio} = userProfileDetails
    return (
      <div className="user-card">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="user-card-heading">{name}</h1>
        <p className="user-card-bio">{shortBio}</p>
      </div>
    )
  }

  renderSearchOptions = () => {
    const {profileApiStatus} = this.state

    let userInfo
    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        userInfo = (
          <div className="profile-loader-container">{this.onLoading()}</div>
        )
        break
      case apiStatusConstants.failure:
        userInfo = (
          <div className="profile-retry-container">
            <button
              type="button"
              className="retry-button"
              onClick={this.getProfile}
            >
              Retry
            </button>
          </div>
        )
        break
      case apiStatusConstants.success:
        userInfo = this.renderUserProfile()
        break
      default:
        userInfo = null
    }

    return (
      <div className="search-options-container">
        {userInfo}
        <hr />
        <div>
          <h1 className="job-route-sub-heading">Type of Employment</h1>
          <ul className="type-of-employment-container">
            {employmentTypesList.map(eachItem => (
              <li>
                <label htmlFor={eachItem.label} key={eachItem.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachItem.label}
                    value={eachItem.employmentTypeId}
                    onChange={this.onClickCheckbox}
                  />
                  {eachItem.label}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr />
        <div>
          <h1 className="job-route-sub-heading">Salary Range</h1>
          <ul className="salary-range-container">
            {salaryRangesList.map(eachItem => (
              <label htmlFor={eachItem.label} key={eachItem.salaryRangeId}>
                <input
                  type="radio"
                  id={eachItem.salaryRangeId}
                  value={eachItem.salaryRangeId}
                  name="salaryRange"
                  onChange={this.onChangeSalary}
                />
                {eachItem.label}
              </label>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return <div className="page-loader-container">{this.onLoading()}</div>
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-page-container">
          {this.renderSearchOptions()}
          <div className="jobs-route-bg">
            <div className="search-container">
              <input
                type="search"
                id="jobSearchInput"
                value={searchInput}
                onChange={this.searchInput}
                onKeyDown={this.searchInput}
                className="job-search-input-field"
              />
              <button
                type="button"
                onClick={this.getJobs}
                aria-label="Search"
                className="search-button"
                data-testid="searchButton"
              >
                <IoIosSearch className="search-icon" />
              </button>
            </div>
            {this.renderPage()}
          </div>
        </div>
      </>
    )
  }
}

export default JobsRoute
