import React from 'react';
import './Experience.css';

const Experience = props => {
	const className = `${props.className || ''} Experience`;
	return (
		<section className={ className }>
			<h1>Pro. Experience</h1>
			<ul class="career-list">
				<li>
					<small>02/2016 - Present</small>
					<a href="http://www.turingscraft.com" target="_blank" class="text-uppercase">TuringsCraft Inc.</a>
					<p>Software Engineer</p></li>
				<li>
					<small>08/2015 - 02/2016</small>
					<a href="_blank" class="text-uppercase">Digital Reasoning</a><p>Professional Services Engineer</p>
				</li>
				<li>
					<small>10/2014-08/2015</small>
					<a href="https://www.mountsinaihealth.org" target="_blank" class="text-uppercase">Mount Sinai Health
						System</a><p>Senior Web Applications Developer</p></li>
				<li>
					<a href="/career">
						<i class="fa fa-3x fa-ellipsis-h" aria-hidden="true" />
					</a>
				</li>
			</ul>
		</section>
	);
}

export default Experience;