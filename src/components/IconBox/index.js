import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './IconBox.css';

class IconBox extends React.Component {
	render() {
		const { external, className='', to, icon, text, ...rest } = this.props;

		if(external) {
			return (
				<a href={ to } className={`IconBox ${className}`} { ...rest }>
					<i className={ icon } />
					<span>{ text }</span>
				</a>
			)
		}

		return (
			<Link to={ to } className={`IconBox ${className}`} { ...rest }>
				<i className={ icon } />
				<span>{ text }</span>
			</Link>
		)
	}
}

IconBox.propTypes = {
	to: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	text : PropTypes.string
}

export default IconBox;