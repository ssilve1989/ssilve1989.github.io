import React from 'react';
import IconBox from '../IconBox/index';
import './Navigation.css';

const Navigation = ({ className='' }) => (
	<nav className={ className }>
		<ul className="Navigation-grid">
			<li className="home-area">
				 <IconBox icon="fa fa-4x fa-home"
				          className="bg-orange hvr-shutter-out-horizontal"
				          to="/"
				          text="Home"
				/>
			</li>
			<li className="resume-area">
				<IconBox icon="fa fa-4x fa-list-alt"
				         className="bg-blue hvr-shutter-out-horizontal"
				         to="/resume"
				         text="Resume"
				/>
			</li>
			<li className="career-area">
				<IconBox icon="fa fa-4x fa-folder-open"
				         className="bg-red hvr-shutter-out-horizontal"
				         to="/career"
				         text="Career"
				/>
			</li>
			<li className="github-area">
				<IconBox icon="fa fa-4x fa-github"
				         className="bg-purple hvr-shutter-out-horizontal"
				         to="https://ssilve1989.github.io"
				         text="GitHub"
				         external
				/>
			</li>
		</ul>
	</nav>
);

export default Navigation;