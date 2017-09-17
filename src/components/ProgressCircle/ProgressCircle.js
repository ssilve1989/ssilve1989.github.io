import React from 'react';
import PropTypes from 'prop-types';
import './ProgressCircle.css';

const ProgressCircle = props => {
	const { progress, radius, strokeWidth } = props;
	const dashArray                         = radius * Math.PI * 2;
	const dashOffset                        = dashArray - dashArray * progress / 100;
	return (
		<svg className="ProgressCircle"
		     width={ 100 }
		     height={ 100 }
		     viewBox="0 0 100 100"
		>
			<circle className="Circle circle-fg"
			        cx={ radius }
			        cy={ radius }
			        r={ radius - 1 }
			        strokeWidth={ `${strokeWidth}px` }
			/>
			<circle className="Circle circle-bg"
			        cx={ radius }
			        cy={ radius }
			        r={ radius - 1 }
			        strokeDasharray={ dashArray }
			        strokeDashoffset={ dashOffset }
			        strokeWidth={ `${strokeWidth}px` }
			        transform="rotate(-90 50 50)"
			/>
			<text className="circle-text" x={ radius } y={ radius } dy=".4em" textAnchor="middle">
				{ props.text }
			</text>
		</svg>
	)
}

ProgressCircle.propTypes = {
	progress: PropTypes.number.isRequired,
	text    : PropTypes.string.isRequired,
	radius  : PropTypes.number
}

ProgressCircle.defaultProps = {
	radius     : 50,
	strokeWidth: 2
}

export default ProgressCircle;