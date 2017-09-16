import React from 'react'
import './Resume.css'

const Resume = props => {
	const className = `${props.className || ''} Resume`

	return (
		<article className={ className }>
			<section>
				<h2 className="Resume-Header">
					<i className="fa fa-user"/>
					Career Profile
				</h2>
				<p>
					I have worked for companies in various spaces ranging from Healthcare to Machine Learning. I've
					worked primarily on Web Applications but have experience in Data Analytics, ETL and Big Data.
					Throughout my career I've often been thrown into using technology stacks I've had zero experience
					with. I always rise to the challenge and deliver quality, efficient solutions.
				</p>
			</section>
			<section>
				<h2 className="Resume-Header">
					<i className="fa fa-briefcase"/>
					Experiences
				</h2>
				<section className="job"><h4>TuringsCraft</h4>
					<div className="job-meta">
						<span className="job-date">Feb 2016 - Present</span>
						<span className="job-title">Software Engineer</span>
						<span className="job-location">Brooklyn, New York</span>
					</div>
					<div className="job-description">
						<p>
							As a software engineer at TuringsCraft, one of my roles was Lead
							FrontEnd Developer for an application redesign of the core product. In this role I drive
							what
							technologies are used, how to serve the application and ensuring quality of the code by
							constant
							code reviews. The technologies I chose for this were React and ES6 along with the Flux
							implementation, Redux.
						</p>
					</div>
				</section>
				<section className="job"><h4>Digital Reasoning</h4>
					<div className="job-meta"><span className="job-date">Aug 2015 - Feb 2016</span><span className="job-title">Professional Services Engineer</span><span
						className="job-location">New York, New York</span></div>
					<div className="job-description">Digital Reasoning is a machine learning, data analytics company that
						provides insights into unstructured data that can help users reason about relationships and
						actions that otherwise would have gone unnoticed. As a Professional Services Engineer, I worked
						with the clients who use Digital Reasoning's software to process their unstructured Data and
						educate them on how to use the software to meet their goals. This included writing code in
						Groovy and Python that ETL'd the clients unstructured data at scale, and prepared it for
						processing by the core software. Efficient coding was critical here to make sure everything
						performed as fast as possible.
					</div>
				</section>
				<section className="job"><h4>Mount Sinai Health System</h4>
					<div className="job-meta"><span className="job-date">Oct 2014 - Aug 2015</span><span className="job-title">Senior Web Applications Developer</span><span
						className="job-location">New York, New York</span></div>
					<div className="job-description">Mount Sinai is a leader in healthcare and the largest healthcare system
						in New York City. Here I led a small team of around 5 developers. We supported a J2EE backed
						site to serve the content for all the hospitals that were part of the Mount Sinai healthsystem.
						This web application leveraged the OpenText WEM content management system. I created a custom
						Java API to interface with it to improve readability, redundancy and quality of the code used to
						serve the site. This API was critical as it allowed for more rapid development of custom JSP
						Views and allowed them to be more dynamic. I played a Full Stack role here dealing with all
						aspects of the web application including system management of the application servers.
					</div>
				</section>
				<section className="job"><h4>The Mount Sinai Hospital</h4>
					<div className="job-meta"><span className="job-date">Jun 2013 - Oct 2014</span><span className="job-title">Web / Java Developer</span><span
						className="job-location">New York, New York</span></div>
					<div className="job-description">The early years. This is where it all began and was my first job after
						graduating with a B.S in Computer Information Systems. Here I learned the fundamental skills for
						web application development and general programming principles that would allow me to move up to
						Senior Web Applications Developer and be qualified enough to lead the team.
					</div>
				</section>
			</section>
			<section>
				<h2 className="Resume-Header">
					<i className="fa fa-code" />
					Skills
				</h2>
				<ul className="Resume-Skills-List">
					<li>
						<span>HTML 5 / CSS</span>
						<div>
							<div className="progress">
								<div className="progress-bar w-100" role="progressbar" aria-valuemin={ 0 } aria-valuenow={ 100 } aria-valuemax={ 100 }/>
							</div>
							<small>
								<em>SASS, LESS, Semantics, Responsive Design, CSS Modules</em>
							</small>
						</div>
					</li>
					<li>
						<span>VCS / DevOps</span>
						<div>
							<div className="progress">
								<div className="progress-bar" aria-valuemin={ 0 } aria-valuenow={ 90 } aria-valuemax={ 100 } style={{ width: '90%' }} />
							</div>
							<small><em>SVN, Git, Maven, NPM</em></small>
						</div>
					</li>
					<li>
						<span>JavaScript / Node.js</span>
						<div>
							<div className="progress">
								<div className="progress-bar" aria-valuemin={ 0 } aria-valuenow={ 90 } aria-valuemax={ 100 } style={{ width: '90%' }} />
							</div>
							<small><em>jQuery, ES6, React, Redux, OOP, Functional Programming</em></small>
						</div>
					</li>
					<li>
						<span>Java / J2EE</span>
						<div>
							<div className="progress">
								<div className="progress-bar" aria-valuemin={ 0 } aria-valuenow={ 90 } aria-valuemax={ 100 } style={{ width: '90%' }} />
							</div>
							<small><em>Java 8, Groovy, Tomcat, JSP, Servlets</em></small>
						</div>
					</li>
					<li>
						<span>Scripting</span>
						<div>
							<div className="progress">
								<div className="progress-bar " aria-valuemin={ 0 } aria-valuenow={ 80 } aria-valuemax={ 100 } style={{ width: '80%' }}/>
							</div>
							<small><em>Python, Bash, Groovy</em></small>
						</div>
					</li>
					<li>
						<span>Big Data</span>
						<div>
							<div className="progress">
								<div className="progress-bar w-50" aria-valuemin={ 0 } aria-valuenow={ 50 } aria-valuemax={ 100 } />
							</div>
							<small><em>Hadoop, NLP, Machine Learning</em></small>
						</div>
					</li>
				</ul>
			</section>
		</article>
	)
}

export default Resume