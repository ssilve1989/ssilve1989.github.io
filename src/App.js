import React, { Component } from 'react'
import TextBox from './components/TextBox'
import logo from './img/html5Logo.png'
import IconBox from './components/IconBox'
import TextScroller from './components/TextScroller'
import Spotlight from './components/Spotlight';
import Navigation from './components/Navigation';
import About from './components/About';
import Experience from './components/Experience';
import Skills from './components/Skills';
import 'hover.css/css/hover.css'
import './index.css';
import './App.css'

class App extends Component {
	render() {
		return (
			<div className="GridContainer">
				<div className="logo-area">
					<img className="img-fluid Logo" src={ logo } alt=""/>
				</div>
				<TextBox className="HeaderBox title-area bg-gray"
				         value={ <h2>Steven Silvestri</h2> }
				/>
				<IconBox className="download-area hvr-sweep-to-right bg-light-gray"
				         icon="fa fa-4x fa-download"
				         to="https://drive.google.com/open?id=0B-QjQxm8doHNeW0xUWVjWUE0V1E"
				         target="_blank"
				         title="Download Resume PDF"
				         rel="noopener noreferrer"
				         external
				/>
				<TextBox className="HeaderBox position-area bg-light-gray"
				         value={ this.getTextScroller() }
				/>
				<IconBox className="linkedin-area hvr-sweep-to-right bg-gray"
				         icon="fa fa-4x fa-linkedin"
				         to="https://www.linkedin.com/in/stevensilvestri"
				         target="_blank"
				         rel="noopener noreferrer"
				         external
				/>
				<Navigation className="nav-area"/>
				<About className="about-me-area"/>
				<Spotlight className="spotlight-area bg-green"/>
				<Experience className="exp-area bg-purple"/>
				<Skills className="skills-area bg-blue"/>
				<footer className="footer-area row">
					<div className="col-md-4">
						<h4>Steve Silvestri</h4>
						<p>Software Engineer, JavaScript Developer</p>
						<small>
							&copy; Steven Silvestri 2017
						</small>
					</div>
					<div className="col-md-4">
						<h4>Download CV</h4>
						<p>
							<a
								href="https://drive.google.com/open?id=0B-QjQxm8doHNeW0xUWVjWUE0V1E" target="_blank">
								<i className="fa fa-arrow-circle-o-down"/>&nbsp; Download</a>
						</p>
					</div>
					<div className="col-md-4">
						<h4>Follow me at</h4>
						<ul className="SocialMedia">
							<li className="social-icon">
								<a href="https://www.github.com/ssilve1989">
									<i className="fa fa-2x fa-github"/>
								</a>
							</li>
							<li className="social-icon">
								<a href="http://www.facebook.com/steve.silvestri.33">
									<i className="fa fa-2x fa-facebook-square"/>
								</a>
							</li>
							<li className="social-icon">
								<a href="https://www.twitter.com/jsx1080">
									<i className="fa fa-2x fa-twitter"/>
								</a>
							</li>
							<li className="social-icon">
								<a href="http://www.instagram.com/jsx1080">
									<i className="fa fa-2x fa-instagram"/>
								</a>
							</li>
							<li className="social-icon">
								<a href="http://www.linkedin.com/in/stevensilvestri">
									<i className="fa fa-2x fa-linkedin"/>
								</a>
							</li>
							<li className="social-icon">
								<a href="http://www.soundcloud.com/stevesilvestri">
									<i className="fa fa-2x fa-soundcloud"/>
								</a>
							</li>
						</ul>
					</div>
				</footer>
			</div>
		)
	}

	getTextScroller = () => (
		<TextScroller fixed="Professional"
		              values={ [
			              'Software Engineer',
			              'Front End Developer',
			              'Java Developer',
			              'JavaScript Engineer'
		              ] }
		/>
	);
}

export default App