import React from 'react';
import Skill from './Skill';
import './Skills.css';

const Skills = props => {
	const className = `${props.className || ''} Skills`;
	return (
		<section className={ className }>
			<h1 className="Experience-header">My Professional Skills</h1>
			<Skill className="Skill skill-1" knowledge={ 95 } skill="Front End">
				<p>
					Proficient in creating Object Oriented JavaScript applications. I have used various JS frameworks
					including jQuery, AngularJS 1.x, and most recently React. I am a huge proponent of the Flux
					architecture and React and most my time recently is spent on these technologies.
				</p>
			</Skill>
			<Skill className="Skill skill-2" knowledge={ 85 } skill="Back End">
				<p>
					Java is my strongest back end oriented language, although I know many others including Python,
					Groovy, PHP, and Node. Learning new languages comes fairly easy to me. Did I mention I have
					experience with Hadoop?
				</p>
			</Skill>
			<Skill className="Skill skill-3" knowledge={ 50 } skill="Design">
				<p>
					As a Full Stack Developer for Web Applications, I often find that I also need to propose UI/UX
					solutions as there often may not be a dedicated person available.
				</p>
			</Skill>
		</section>
	)
}

export default Skills;