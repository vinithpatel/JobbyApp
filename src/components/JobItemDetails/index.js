import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar, AiTwotoneEnvironment} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import SimilarJobCard from '../SimilarJobCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAIL',
  inProgress: 'PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    jobItemApiStatus: apiStatusConstants.initail,
    jobItemDetails: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getCamelCaseData = jobsArray =>
    jobsArray.map(eachObject => ({
      companyLogoUrl: eachObject.company_logo_url,
      employmentType: eachObject.employment_type,
      id: eachObject.id,
      jobDescription: eachObject.job_description,
      location: eachObject.location,

      rating: eachObject.rating,
      title: eachObject.title,
    }))

  getCamelCaseSkillsData = skillsArray =>
    skillsArray.map(eachObject => ({
      imageUrl: eachObject.image_url,
      name: eachObject.name,
    }))

  getJobItemDetails = async () => {
    this.setState({jobItemApiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()

      const formatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: this.getCamelCaseSkillsData(data.job_details.skills),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,

          title: data.job_details.title,
        },
        similarJobs: this.getCamelCaseData(data.similar_jobs),
      }
      this.setState({
        jobItemApiStatus: apiStatusConstants.success,
        jobItemDetails: formatedData,
      })
    } else {
      this.setState({jobItemApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItemsDetailsView = () => {
    const {jobItemDetails} = this.state
    const {jobDetails, similarJobs} = jobItemDetails
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      skills,
      lifeAtCompany,
      location,
      packagePerAnnum,
      title,
      rating,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <div className="job-item-details-container">
          <div className="job-card-logo-container">
            <img
              className="job-card-company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="job-card-name-card">
              <h1 className="job-card-title">{title}</h1>
              <div className="job-rating-card">
                <AiFillStar className="star-icn" />
                <p className="rating-para">{rating}</p>
              </div>
            </div>
          </div>
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
            <p className="package-para">{packagePerAnnum}</p>
          </div>
          <hr className="horizental-rule" />
          <div className="job-item-details-desc-card">
            <div className="desc-heading-card">
              <h1 className="desc-heading">Description</h1>
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="visit-link"
              >
                Visit <BiLinkExternal className="visit-icon" />
              </a>
            </div>
            <p className="job-card-desc">{jobDescription}</p>
          </div>
          <div className="skills-card">
            <h1 className="desc-heading">Skills</h1>
            <ul className="list-of-skills">
              {skills.map(eachObject => (
                <li key={eachObject.name} className="skill-item">
                  <img
                    className="skill-image"
                    src={eachObject.imageUrl}
                    alt={eachObject.name}
                  />
                  <p className="skill-name">{eachObject.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <h1 className="desc-heading">Life at Company</h1>
          <div className="life-at-company-card">
            <p className="job-card-desc">{description}</p>
            <img
              className="life-at-company-image"
              src={imageUrl}
              alt="life at company"
            />
          </div>
        </div>
        <div className="similar-jobs-bg-container">
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="list-of-similar-jobs">
            {similarJobs.map(eachObject => (
              <SimilarJobCard key={eachObject.id} jobCardDetails={eachObject} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

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
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  getResources = () => {
    const {jobItemApiStatus} = this.state

    switch (jobItemApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemsDetailsView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-bg-container">
          {this.getResources()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
