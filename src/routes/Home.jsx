import React from 'react';
import About from '../components/About/index';
import Spotlight from '../components/Spotlight/index';
import Experience from '../components/Experience/index';
import Skills from '../components/Skills/index';
import './routes.css';
import ScrollTop from '../components/ScrollTop';

const Home = () => (
  <div className="Home">
    <About className="about-me-area" />
    <Spotlight className="spotlight-area bg-green" />
    <Experience className="exp-area bg-purple" />
    <Skills className="skills-area bg-blue" />
  </div>
);

export default ScrollTop(Home);
