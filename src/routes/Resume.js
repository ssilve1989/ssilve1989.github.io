import React from 'react';
import Contact from '../components/Contact';
import Resume from '../components/Resume/index';
import './routes.css';

const ResumeRoute = props => {
	return (
		<div className="ResumeGrid">
			<Contact className="resume-left" />
			<Resume className="resume-right"/>
		</div>
	)
};

export default ResumeRoute;