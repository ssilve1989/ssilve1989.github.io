import React from 'react';
import PropTypes from 'prop-types';
import './IconBox.css';

class IconBox extends React.Component {
	render() {
		const { className='', to, icon, text, ...rest } = this.props;

		return (
			<a href={ to } className={`IconBox ${className}`} { ...rest }>
				<i className={ icon } />
				<span>{ text }</span>
			</a>
		)
	}
}

IconBox.propTypes = {
	to: PropTypes.string.isRequired,
	icon: PropTypes.string.isRequired,
	text : PropTypes.string
}

export default IconBox;