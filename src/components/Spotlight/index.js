import React from 'react';
import './Spotlight.css';

const npmPackages = [
	{
		link: 'https://www.npmjs.com/package/redux-session-manager',
		name: 'Redux Session Manager'
	},
	{
		link: 'https://www.npmjs.com/package/react-redux-dialog',
		name: 'React Redux Dialog'
	},
	{
		link: 'https://www.npmjs.com/package/flux-standard-error',
		name: 'Flux Standard Error'
	}
]

const Spotlight = props => {
	const className = `${props.className || ''} Spotlight`;
	return (
		<section className={ className }>
			<header className="text-center">
				<h1>Spotlight</h1>
				<i className="fa fa-4x fa-code-fork"/>
				<h5>Open Source Development</h5>
			</header>
			<ul>
				{ npmPackages.map(item => (
					<li>
						<a href={ item.link }>{ item.name }</a>
					</li>
				)) }
			</ul>
		</section>
	)
}

export default Spotlight;