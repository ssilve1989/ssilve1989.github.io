import React from 'react';
import About from '../components/About/index';
import Spotlight from '../components/Spotlight/index';
import Experience from '../components/Experience/index';
import Skills from '../components/Skills/index';
import './Home.css';

const Home = () => (
	<div className="Home RouteContainer">
		<About className="about-me-area"/>
		<Spotlight className="spotlight-area bg-green"/>
		<Experience className="exp-area bg-purple"/>
		<Skills className="skills-area bg-blue"/>
	</div>
);

export default Home;