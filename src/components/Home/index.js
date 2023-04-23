import Header from '../Header'
import './index.css'

const Home = props => {
  const {history} = props

  const onClickFindJobs = () => {
    history.push('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-bg-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-para">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential
        </p>
        <button
          type="button"
          className="find-jobs-button"
          onClick={onClickFindJobs}
        >
          Find Jobs
        </button>
      </div>
    </>
  )
}

export default Home
