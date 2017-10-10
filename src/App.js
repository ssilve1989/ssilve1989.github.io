import React, { Component } from 'react'
import Resume from './routes/Resume';
import 'hover.css/css/hover.css'
import './index.css';
import './App.css'

class App extends Component {
	render() {
		return (
			<div className="GridContainer">
				<main className="RouteContainer">
					<Resume/>
				</main>
			</div>
		)
	}
}

export default App