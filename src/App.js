import React, { Component } from 'react'
import TextBox from './components/TextBox'
import logo from './img/html5Logo.png'
import IconBox from './components/IconBox'
import TextScroller from './components/TextScroller'
import Spotlight from './components/Spotlight';
import Navigation from './components/Navigation';
import About from './components/About';
import Experience from './components/Experience/index';
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
				/>
				<TextBox className="HeaderBox position-area bg-light-gray"
				         value={ this.getTextScroller() }
				/>
				<IconBox className="linkedin-area hvr-sweep-to-right bg-gray"
				         icon="fa fa-4x fa-linkedin"
				         to="https://www.linkedin.com/in/stevensilvestri"
				         target="_blank"
				/>
				<Navigation className="nav-area"/>
				<About className="about-me-area" />
				<Spotlight className="spotlight-area bg-green" />
				<Experience className="exp-area bg-purple" />
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
