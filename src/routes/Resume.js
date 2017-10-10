import React from 'react';
import Contact from '../components/Contact';
import Resume from '../components/Resume/index';
import ScrollTop from '../components/ScrollTop';
import './routes.css';

const ResumeRoute = () => {
	return (
		<div className="ResumeGrid">
			<Contact className="resume-left"/>
			<Resume className="resume-right"/>
		</div>
	)
};

export default ScrollTop(ResumeRoute);