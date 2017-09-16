import React from 'react';
import './Contact.css';
import { Link } from 'react-router-dom';

const Contact = ({ className }) => (
	<div className={`Contact ${className}`}>
		<section className="Contact-Header">
			<h1>Steve Silvestri</h1>
			<p className="Contact-SubHeader">Software Engineer</p>
		</section>
		<section className="Contact-Body">
			<section>
				<ul>
					<li>
						<i className="fa fa-envelope" />
						<a href="mailto:steven.m.silvestri@gmail.com">steven.m.silvestri@gmail.com</a>
					</li>
					<li>
						<i className="fa fa-linkedin" />
						<a href="https://www.linkedin.com/in/stevensilvestri">
							linkedin.com/in/stevesilvestri
						</a>
					</li>
					<li>
						<i className="fa fa-github" />
						<a href="https://www.github.com/ssilve1989">
							github.com/ssilve1989
						</a>
					</li>
					<li>
						<i className="fa fa-globe" />
						<Link to="/">ssilve1989.github.io</Link>
					</li>
				</ul>
			</section>
			<section>
				<h3>Education</h3>
				<p>B.S. in Computer Science</p>
				<p>Brooklyn College</p>
				<p>2007 - 2013</p>
			</section>
			<section>
				<h3>Interests</h3>
				<ul>
					<li>Web Development</li>
					<li>JavaScript</li>
					<li>Guitar</li>
					<li>BodyBuilding</li>
					<li>PowerLifting</li>
				</ul>
			</section>
		</section>
	</div>
);

export default Contact;