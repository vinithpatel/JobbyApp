import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'PROGRESS',
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

class Jobs extends Component {
  state = {
    profileApiStatus: apiStatusConstants.initial,
    jobsApiStatus: apiStatusConstants.initial,
    profileDetails: {},
    jobsDetails: {},
    searchText: '',
    employmentType: [],
    salaryRangeId: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileApiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const formatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: formatedData,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  getCamelCaseData = jobsArray =>
    jobsArray.map(eachObject => ({
      companyLogoUrl: eachObject.company_logo_url,
      employmentType: eachObject.employment_type,
      id: eachObject.id,
      jobDescription: eachObject.job_description,
      location: eachObject.location,
      packagePerAnnum: eachObject.package_per_annum,
      rating: eachObject.rating,
      title: eachObject.title,
    }))

  getJobsDetails = async () => {
    this.setState({jobsApiStatus: apiStatusConstants.inProgress})
    const {searchText, employmentType, salaryRangeId} = this.state

    const commaSeparatedData = employmentType.join(',')

    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${commaSeparatedData}&minimum_package=${salaryRangeId}&search=${searchText}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(jobsApiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formatedJobsData = {
        jobs: this.getCamelCaseData(data.jobs),
        total: data.total,
      }

      this.setState({
        jobsDetails: formatedJobsData,
        jobsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearchText = event => {
    this.setState({searchText: event.target.value})
  }

  updateTypesOfEmployment = event => {
    this.setState(prevState => {
      const {employmentType} = prevState
      if (!employmentType.includes(event.target.value)) {
        return {
          employmentType: [...prevState.employmentType, event.target.value],
        }
      }
      return {
        employmentType: prevState.employmentType.filter(
          each => each !== event.target.value,
        ),
      }
    }, this.getJobsDetails)
  }

  onUpdateSalaryRange = event => {
    this.setState({salaryRangeId: event.target.value}, this.getJobsDetails)
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <>
        <div className="profile-card">
          <img className="user-image" src={profileImageUrl} alt="profile" />
          <h1 className="user-name">{name}</h1>
          <p className="user-bio">{shortBio}</p>
        </div>
        <hr className="horizental-rule" />
      </>
    )
  }

  renderFailureProfile = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  renderTypesofEmployement = () => (
    <div className="types-of-employement-card filter-card">
      <h1 className="filter-heading">Type of Employment</h1>
      <ul className="filter-list-items">
        {employmentTypesList.map(eachObject => (
          <li key={eachObject.employmentTypeId} className="input-item">
            <input
              id={eachObject.employmentTypeId}
              type="checkbox"
              className="checkbox"
              value={eachObject.employmentTypeId}
              onClick={this.updateTypesOfEmployment}
            />
            <label
              htmlFor={eachObject.employmentTypeId}
              className="checkbox-label"
            >
              {eachObject.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRangesFilter = () => (
    <div className="filter-card">
      <h1 className="filter-heading">Salary Range</h1>
      <ul className="filter-list-items">
        {salaryRangesList.map(eachObject => (
          <li key={eachObject.salaryRangeId} className="input-item">
            <input
              id={eachObject.salaryRangeId}
              type="radio"
              className="checkbox"
              name="salaryRange"
              value={eachObject.salaryRangeId}
              onClick={this.onUpdateSalaryRange}
            />
            <label
              htmlFor={eachObject.salaryRangeId}
              className="checkbox-label"
            >
              {eachObject.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderNoJobsView = () => (
    <div className="jobs-failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="failure-heading">No Jobs Found</h1>
      <p className="failure-para">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderJobs = () => {
    const {jobsDetails} = this.state
    const {total, jobs} = jobsDetails
    if (total === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="jobs-container">
        {jobs.map(eachJobObject => (
          <JobCard key={eachJobObject.id} jobCardDetails={eachJobObject} />
        ))}
      </ul>
    )
  }

  getProfileResources = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.success:
        return this.renderProfile()
      case apiStatusConstants.failure:
        return this.renderFailureProfile()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobsFailureView = () => (
    <div className="jobs-failure-view">
      <img
        className="failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  getJobsResources = () => {
    const {jobsApiStatus} = this.state

    switch (jobsApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobs()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {searchText} = this.state
    return (
      <>
        <Header />
        <div className="jobs-page-bg-container">
          <div className="profile-and-filters-container">
            <div className="sm-search search-input-container">
              <input
                type="search"
                className="jobs-search-input"
                value={searchText}
                placeholder="Search"
                onChange={this.onChangeSearchText}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.getJobsDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>

            {this.getProfileResources()}
            {this.renderTypesofEmployement()}
            <hr className="horizental-rule" />
            {this.renderSalaryRangesFilter()}
          </div>
          <div className="jobs-bg-container">
            <div className="lg-search search-input-container">
              <input
                type="search"
                className="jobs-search-input"
                value={searchText}
                placeholder="Search"
                onChange={this.onChangeSearchText}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
                onClick={this.getJobsDetails}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="jobs-body-container">{this.getJobsResources()}</div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
